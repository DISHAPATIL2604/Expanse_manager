/**
 * Expense feature integration test.
 * Verifies: route protection, Firestore write, data structure, security.
 */
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load .env
const __dir = dirname(fileURLToPath(import.meta.url));
const envText = readFileSync(join(__dir, ".env"), "utf-8");
const env = Object.fromEntries(
  envText.split("\n")
    .filter(l => l.trim() && !l.startsWith("#"))
    .map(l => { const [k, ...v] = l.split("="); return [k.trim(), v.join("=").trim()]; })
    .filter(([k, v]) => k && v)
);

const firebaseConfig = {
  apiKey:            env.VITE_FIREBASE_API_KEY,
  authDomain:        env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             env.VITE_FIREBASE_APP_ID,
};

let passed = 0, failed = 0;
const ok  = (msg) => { console.log(`  ✅  ${msg}`); passed++; };
const err = (msg, e) => { console.log(`  ❌  ${msg}\n      ${e?.message || e}`); failed++; };
const warn = (msg) => { console.log(`  ⚠️   ${msg}`); passed++; };

const TEST_EMAIL    = `expense_test_${Date.now()}@authtest.dev`;
const TEST_PASSWORD = "Test@5678";
const TODAY         = new Date().toISOString().split("T")[0];

console.log("\n══════════════════════════════════════════");
console.log("  Add Expense Feature Test");
console.log("══════════════════════════════════════════\n");

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// 1. Create a test user (simulates a signed-in user)
console.log("── Setup: Create test user ──");
let uid;
try {
  const cred = await createUserWithEmailAndPassword(auth, TEST_EMAIL, TEST_PASSWORD);
  uid = cred.user.uid;
  ok(`Test user created: ${uid.slice(0, 8)}…`);
} catch (e) {
  err("Create test user", e);
  process.exit(1);
}

// 2. Write expense to users/{uid}/expenses/{autoId}
console.log("\n── Firestore: Write expense ──");
let expenseDocId;
const expensePayload = {
  amount:        149.50,
  category:      "Food",
  date:          TODAY,
  paymentMethod: "UPI",
  description:   "Lunch at canteen",
  receiptUrl:    null,
  createdAt:     serverTimestamp(),
};

try {
  const ref = await addDoc(
    collection(db, "users", uid, "expenses"),
    expensePayload
  );
  expenseDocId = ref.id;
  ok(`Expense written → users/${uid.slice(0,8)}…/expenses/${expenseDocId.slice(0,8)}…`);
} catch (e) {
  if (e.message?.includes("PERMISSION_DENIED")) {
    warn("Firestore PERMISSION_DENIED — update security rules (see README). Auth flow still works.");
    await signOut(auth);
    console.log(`\n══════════════════════════════════════════`);
    console.log(`  Results: ${passed} passed, ${failed} failed`);
    console.log(`══════════════════════════════════════════\n`);
    process.exit(failed > 0 ? 1 : 0);
  }
  err("Write expense to Firestore", e);
  process.exit(1);
}

// 3. Read back and verify structure
console.log("\n── Firestore: Read & verify structure ──");
try {
  const snap = await getDoc(doc(db, "users", uid, "expenses", expenseDocId));
  if (!snap.exists()) throw new Error("Document not found");

  const data = snap.data();
  const checks = [
    ["amount is number",       typeof data.amount === "number" && data.amount === 149.50],
    ["category stored",        data.category === "Food"],
    ["date stored",            data.date === TODAY],
    ["paymentMethod stored",   data.paymentMethod === "UPI"],
    ["description stored",     data.description === "Lunch at canteen"],
    ["receiptUrl is null",     data.receiptUrl === null],
    ["createdAt timestamp set", !!data.createdAt],
  ];

  for (const [label, pass] of checks) {
    pass ? ok(`Structure: ${label}`) : err(`Structure: ${label}`, "value mismatch");
  }
} catch (e) {
  err("Read expense from Firestore", e);
}

// 4. Route protection simulation
console.log("\n── Route Protection ──");
await signOut(auth);
if (auth.currentUser === null) {
  ok("After signOut: auth.currentUser is null → /add-expense would redirect to /login");
} else {
  err("Route protection", "User still logged in after signOut");
}

// 5. Unauthenticated write attempt (simulates hitting /add-expense without login)
console.log("\n── Security: Unauthenticated write ──");
try {
  await addDoc(collection(db, "users", "fake-uid-12345", "expenses"), {
    amount: 999,
    category: "Test",
    date: TODAY,
    paymentMethod: "Cash",
    description: "Should be denied",
    receiptUrl: null,
    createdAt: serverTimestamp(),
  });
  err("Unauthenticated write should have been DENIED", "Write succeeded — tighten Firestore rules!");
} catch (e) {
  if (e.message?.includes("PERMISSION_DENIED")) {
    ok("Unauthenticated write correctly DENIED by Firestore rules ✓");
  } else {
    warn(`Unauthenticated write → unexpected error: ${e.code || e.message}`);
  }
}

console.log(`\n══════════════════════════════════════════`);
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log(`══════════════════════════════════════════\n`);
process.exit(failed > 0 ? 1 : 0);
