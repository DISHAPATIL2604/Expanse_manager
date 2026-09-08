// src/services/authService.js
// All Firebase Authentication functions are centralized here for clean separation of concerns.

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

/**
 * Sign up a new user with email and password.
 * Also updates their displayName, sends a verification email,
 * and creates a Firestore user document.
 */
export const signUpUser = async (name, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update the Firebase Auth profile with the user's display name
  await updateProfile(user, { displayName: name });

  // Send the Firebase email verification
  await sendEmailVerification(user);

  // Create a user document in Firestore under users/{uid}
  // Non-fatal: if Firestore security rules block this write, Auth signup still succeeds.
  try {
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      createdAt: serverTimestamp(),
    });
  } catch (firestoreErr) {
    console.warn("Firestore user doc write failed (check security rules):", firestoreErr.message);
  }

  return user;
};

/**
 * Resend a Firebase verification email to the currently signed-in user.
 */
export const sendVerificationEmail = async () => {
  if (!auth.currentUser) throw new Error("No authenticated user.");
  await sendEmailVerification(auth.currentUser);
};

/**
 * Reload the current user from Firebase to get the latest emailVerified state,
 * then return the updated user object.
 */
export const reloadUser = async () => {
  if (!auth.currentUser) throw new Error("No authenticated user.");
  await auth.currentUser.reload();
  return auth.currentUser;
};

/**
 * Log in an existing user with email and password.
 */
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

/**
 * Log out the currently authenticated user.
 */
export const logoutUser = async () => {
  await signOut(auth);
};

/**
 * Send a password reset email to the given address.
 */
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

/**
 * Subscribe to authentication state changes.
 * Returns an unsubscribe function — call it to stop listening.
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Map Firebase error codes to friendly, user-facing messages.
 */
export const getFriendlyErrorMessage = (errorCode) => {
  const errors = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/too-many-requests": "Too many failed attempts. Please try again later.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/invalid-credential": "Invalid email or password. Please try again.",
    "auth/user-disabled": "This account has been disabled.",
  };
  return errors[errorCode] || "Something went wrong. Please try again.";
};
