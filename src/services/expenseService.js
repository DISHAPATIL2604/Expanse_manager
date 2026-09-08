// src/services/expenseService.js
// Firestore operations for the expense feature.
// Keeps all database logic out of UI components.

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Add a new expense document under users/{uid}/expenses/{auto-id}.
 *
 * @param {string} uid           - The authenticated user's UID
 * @param {Object} expenseData   - Validated expense fields from the form
 * @returns {Promise<string>}    - The new document ID
 */
export const addExpense = async (uid, expenseData) => {
  const expensesRef = collection(db, "users", uid, "expenses");

  const docRef = await addDoc(expensesRef, {
    amount:        Number(expenseData.amount),
    category:      expenseData.category,
    date:          expenseData.date,           // ISO date string "YYYY-MM-DD"
    paymentMethod: expenseData.paymentMethod,
    description:   expenseData.description || "",
    receiptUrl:    null,                        // Firebase Storage — coming later
    createdAt:     serverTimestamp(),
  });

  return docRef.id;
};
