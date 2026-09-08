// src/pages/AddExpense.jsx
// Add Expense page — glassmorphism design matching the existing auth pages.
// Saves to Firestore at: users/{uid}/expenses/{expenseId}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addExpense } from "../services/expenseService";

// ── Constants ──────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "College",
  "Food",
  "Clothes",
  "Groceries",
  "Petrol",
  "Transportation",
  "Hospital / Medical",
  "Home Rent",
  "Mess Fees",
  "Electricity",
  "Mobile / Internet",
  "Education",
  "Entertainment",
  "Shopping",
  "Travel",
  "Personal Care",
  "Other",
];

const PAYMENT_METHODS = [
  "Cash",
  "UPI",
  "Debit Card",
  "Credit Card",
  "Bank Transfer",
  "Other",
];

// Today's date formatted as "YYYY-MM-DD" for the date input default
const todayISO = () => new Date().toISOString().split("T")[0];

// ── Category icon map (emoji) ──────────────────────────────────────────────────
const CATEGORY_ICONS = {
  "College": "🎓",
  "Food": "🍔",
  "Clothes": "👕",
  "Groceries": "🛒",
  "Petrol": "⛽",
  "Transportation": "🚌",
  "Hospital / Medical": "🏥",
  "Home Rent": "🏠",
  "Mess Fees": "🍱",
  "Electricity": "⚡",
  "Mobile / Internet": "📱",
  "Education": "📚",
  "Entertainment": "🎬",
  "Shopping": "🛍️",
  "Travel": "✈️",
  "Personal Care": "💆",
  "Other": "📦",
};

// ── Component ──────────────────────────────────────────────────────────────────
const AddExpense = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // ── Form state ───────────────────────────────────────────────────────────────
  const [amount,        setAmount]        = useState("");
  const [category,      setCategory]      = useState("");
  const [date,          setDate]          = useState(todayISO());
  const [paymentMethod, setPaymentMethod] = useState("");
  const [description,   setDescription]  = useState("");
  const [receipt,       setReceipt]       = useState(null);

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);

  // ── Validation ────────────────────────────────────────────────────────────────
  const validate = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return "Please enter a valid amount greater than ₹0.";
    if (!category)
      return "Please select an expense category.";
    if (!date)
      return "Please select a date.";
    if (!paymentMethod)
      return "Please select a payment method.";
    return null;
  };

  // ── Reset form ────────────────────────────────────────────────────────────────
  const resetForm = () => {
    setAmount("");
    setCategory("");
    setDate(todayISO());
    setPaymentMethod("");
    setDescription("");
    setReceipt(null);
    // Reset file input visually
    const fileInput = document.getElementById("receipt-input");
    if (fileInput) fileInput.value = "";
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const validationError = validate();
    if (validationError) return setError(validationError);

    setSaving(true);
    try {
      await addExpense(currentUser.uid, {
        amount,
        category,
        date,
        paymentMethod,
        description,
      });
      setSuccess(true);
      resetForm();
    } catch (err) {
      console.error("Failed to save expense:", err);
      if (err.code === "permission-denied" || err.message?.includes("PERMISSION_DENIED")) {
        setError(
          "Permission denied — update your Firestore security rules to allow authenticated writes. See README."
        );
      } else {
        setError("Failed to save expense. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      {/* Background */}
      <div style={styles.bgOverlay} />
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      {/* ── Navbar ── */}
      <nav style={styles.nav} className="ae-nav">
        <Link to="/dashboard" style={styles.backBtn} className="ae-back-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Dashboard
        </Link>
        <div style={styles.navBrand}>
          <div style={styles.navLogo}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <span style={styles.navTitle}>AuthApp</span>
        </div>
      </nav>

      {/* ── Card ── */}
      <main style={styles.main}>
        <div style={styles.card} className="ae-card">

          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerIcon}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <h1 style={styles.heading}>Add Expense</h1>
            <p style={styles.subtitle}>Record your spending</p>
          </div>

          {/* ── Success state ── */}
          {success && (
            <div style={styles.successBox} className="ae-success">
              <span style={styles.successCheck}>✓</span>
              <div>
                <p style={styles.successTitle}>Expense saved!</p>
                <p style={styles.successSub}>Your expense has been recorded successfully.</p>
              </div>
              <div style={styles.successActions}>
                <button
                  onClick={() => setSuccess(false)}
                  style={styles.addAnotherBtn}
                  className="ae-add-another"
                >
                  + Add Another
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  style={styles.dashBtn}
                  className="ae-dash-btn"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {error && <div style={styles.errorBox}>{error}</div>}

          {/* ── Form ── */}
          {!success && (
            <form onSubmit={handleSubmit} style={styles.form} noValidate>

              {/* ── Row 1: Amount + Category ── */}
              <div style={styles.row}>
                {/* Amount */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Amount <span style={styles.required}>*</span></label>
                  <div style={styles.amountWrapper}>
                    <span style={styles.rupee}>₹</span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      style={{ ...styles.input, paddingLeft: "40px" }}
                      className="ae-input"
                    />
                  </div>
                </div>

                {/* Category */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Category <span style={styles.required}>*</span></label>
                  <div style={styles.selectWrapper}>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      style={{
                        ...styles.input,
                        ...styles.select,
                        color: category ? "#f1f5f9" : "rgba(148,163,184,0.6)",
                      }}
                      className="ae-input ae-select"
                    >
                      <option value="" disabled hidden>Select category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} style={styles.option}>
                          {CATEGORY_ICONS[cat]} {cat}
                        </option>
                      ))}
                    </select>
                    <span style={styles.selectArrow}>▾</span>
                  </div>
                </div>
              </div>

              {/* ── Row 2: Date + Payment Method ── */}
              <div style={styles.row}>
                {/* Date */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Date <span style={styles.required}>*</span></label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    max={todayISO()}
                    style={{ ...styles.input, colorScheme: "dark" }}
                    className="ae-input"
                  />
                </div>

                {/* Payment Method */}
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Payment Method <span style={styles.required}>*</span></label>
                  <div style={styles.selectWrapper}>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      required
                      style={{
                        ...styles.input,
                        ...styles.select,
                        color: paymentMethod ? "#f1f5f9" : "rgba(148,163,184,0.6)",
                      }}
                      className="ae-input ae-select"
                    >
                      <option value="" disabled hidden>Select method</option>
                      {PAYMENT_METHODS.map((m) => (
                        <option key={m} value={m} style={styles.option}>{m}</option>
                      ))}
                    </select>
                    <span style={styles.selectArrow}>▾</span>
                  </div>
                </div>
              </div>

              {/* ── Description ── */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Description / Notes <span style={styles.optional}>(optional)</span></label>
                <textarea
                  placeholder="What was this expense for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  style={styles.textarea}
                  className="ae-input ae-textarea"
                />
              </div>

              {/* ── Receipt Upload ── */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Receipt <span style={styles.optional}>(optional)</span></label>
                <label style={styles.fileLabel} className="ae-file-label" htmlFor="receipt-input">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span style={styles.fileText}>
                    {receipt ? receipt.name : "Upload receipt image"}
                  </span>
                  <span style={styles.fileHint}>JPG, JPEG, PNG, WEBP</span>
                  <input
                    id="receipt-input"
                    type="file"
                    accept="image/jpg,image/jpeg,image/png,image/webp"
                    onChange={(e) => setReceipt(e.target.files[0] || null)}
                    style={{ display: "none" }}
                  />
                </label>
                {receipt && (
                  <button
                    type="button"
                    onClick={() => {
                      setReceipt(null);
                      document.getElementById("receipt-input").value = "";
                    }}
                    style={styles.clearFile}
                  >
                    ✕ Remove
                  </button>
                )}
              </div>

              {/* ── Submit ── */}
              <button
                type="submit"
                disabled={saving}
                style={{ ...styles.submitBtn, opacity: saving ? 0.7 : 1 }}
                className="ae-submit"
              >
                {saving ? (
                  <span style={styles.loadingRow}>
                    <span className="ae-spinner" style={styles.spinnerEl} />
                    Saving…
                  </span>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Save Expense
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* ── Scoped styles ── */}
      <style>{`
        @keyframes blobPulse1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(30px,-20px) scale(1.08); }
        }
        @keyframes blobPulse2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-20px,30px) scale(1.05); }
        }
        @keyframes cardIn {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes successSlide {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .ae-card { animation: cardIn 0.45s ease forwards; }

        /* Input focus */
        .ae-input:focus {
          outline: none;
          border-color: rgba(167,139,250,0.7) !important;
          background: rgba(255,255,255,0.1) !important;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.2);
        }
        .ae-input::placeholder { color: rgba(148,163,184,0.55); }
        .ae-input:-webkit-autofill,
        .ae-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #f1f5f9;
          -webkit-box-shadow: 0 0 0px 1000px rgba(30,20,60,0.9) inset;
        }
        .ae-input { transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease; }

        /* Select dropdown native options */
        .ae-select option { background: #1e1440; color: #f1f5f9; }

        /* Textarea */
        .ae-textarea { resize: vertical; min-height: 80px; max-height: 180px; }

        /* File label hover */
        .ae-file-label:hover { border-color: rgba(167,139,250,0.5) !important; background: rgba(255,255,255,0.08) !important; }
        .ae-file-label { transition: border-color 0.2s ease, background 0.2s ease; }

        /* Back button */
        .ae-back-btn:hover { color: #a78bfa !important; }
        .ae-back-btn { transition: color 0.2s ease; }

        /* Submit button */
        .ae-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(124,58,237,0.55) !important; }
        .ae-submit:active:not(:disabled) { transform: translateY(0); }
        .ae-submit { transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease; }

        /* Loading spinner */
        .ae-spinner {
          width:16px; height:16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* Success actions */
        .ae-add-another:hover { background: rgba(255,255,255,0.1) !important; }
        .ae-dash-btn:hover { box-shadow: 0 6px 22px rgba(124,58,237,0.5) !important; transform: translateY(-1px); }
        .ae-add-another, .ae-dash-btn { transition: all 0.2s ease; }

        /* Responsive */
        @media (max-width: 560px) {
          .ae-card { padding: 28px 18px !important; }
          .ae-nav  { padding: 0 16px !important; }
        }
        @media (max-width: 640px) {
          .ae-row  { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80&fm=webp')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  bgOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(15,12,41,0.9) 0%, rgba(48,43,99,0.85) 50%, rgba(36,36,62,0.9) 100%)",
    zIndex: 0,
  },
  blob1: {
    position: "absolute",
    width: "500px", height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
    top: "-100px", left: "-150px",
    animation: "blobPulse1 8s ease-in-out infinite",
    zIndex: 0,
  },
  blob2: {
    position: "absolute",
    width: "400px", height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)",
    bottom: "-80px", right: "-100px",
    animation: "blobPulse2 10s ease-in-out infinite",
    zIndex: 0,
  },

  /* Navbar */
  nav: {
    position: "relative", zIndex: 10,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    height: "64px", padding: "0 40px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
    background: "rgba(255,255,255,0.04)",
  },
  backBtn: {
    display: "flex", alignItems: "center", gap: "6px",
    color: "rgba(203,213,225,0.8)", fontSize: "14px", fontWeight: "500",
    textDecoration: "none",
  },
  navBrand: { display: "flex", alignItems: "center", gap: "10px" },
  navLogo: {
    width: "32px", height: "32px", borderRadius: "10px",
    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 10px rgba(124,58,237,0.4)",
  },
  navTitle: { fontSize: "15px", fontWeight: "700", color: "#f1f5f9" },

  /* Main */
  main: {
    position: "relative", zIndex: 1,
    display: "flex", justifyContent: "center",
    minHeight: "calc(100vh - 64px)",
    padding: "40px 20px 60px",
  },

  /* Card */
  card: {
    width: "100%", maxWidth: "680px",
    padding: "44px 48px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.13)",
    backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.08) inset",
    alignSelf: "flex-start",
  },

  /* Header */
  header: { textAlign: "center", marginBottom: "36px" },
  headerIcon: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    width: "54px", height: "54px", borderRadius: "16px",
    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
    marginBottom: "18px",
    boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
  },
  heading: {
    fontSize: "26px", fontWeight: "700", color: "#f1f5f9",
    marginBottom: "8px", letterSpacing: "-0.02em",
  },
  subtitle: { fontSize: "14px", color: "rgba(148,163,184,0.85)" },

  /* Form layout */
  form: { display: "flex", flexDirection: "column", gap: "22px" },
  row: { display: "flex", gap: "16px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "8px", flex: 1 },

  /* Labels */
  label: { fontSize: "13px", fontWeight: "500", color: "rgba(203,213,225,0.9)", letterSpacing: "0.03em" },
  required: { color: "#f87171", marginLeft: "2px" },
  optional: { color: "rgba(148,163,184,0.55)", fontSize: "12px", marginLeft: "4px" },

  /* Shared input base */
  input: {
    width: "100%", height: "46px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "12px",
    color: "#f1f5f9", fontSize: "14px", fontWeight: "400",
    paddingLeft: "14px", paddingRight: "14px",
    fontFamily: "inherit",
  },

  /* Amount field */
  amountWrapper: { position: "relative" },
  rupee: {
    position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)",
    color: "rgba(167,139,250,0.9)", fontSize: "15px", fontWeight: "600", zIndex: 1,
    pointerEvents: "none",
  },

  /* Select */
  select: { appearance: "none", WebkitAppearance: "none", paddingRight: "36px", cursor: "pointer" },
  selectWrapper: { position: "relative" },
  selectArrow: {
    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
    color: "rgba(148,163,184,0.6)", fontSize: "13px", pointerEvents: "none",
  },
  option: { background: "#1e1440", color: "#f1f5f9" },

  /* Textarea */
  textarea: {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "12px",
    color: "#f1f5f9", fontSize: "14px",
    padding: "12px 14px",
    fontFamily: "inherit",
    lineHeight: "1.55",
  },

  /* File upload */
  fileLabel: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "14px 16px", borderRadius: "12px",
    background: "rgba(255,255,255,0.05)",
    border: "1.5px dashed rgba(255,255,255,0.18)",
    cursor: "pointer",
  },
  fileText: { fontSize: "13px", color: "rgba(203,213,225,0.85)", flex: 1 },
  fileHint: { fontSize: "11px", color: "rgba(148,163,184,0.55)" },
  clearFile: {
    alignSelf: "flex-start", marginTop: "6px",
    background: "transparent", border: "none",
    color: "rgba(248,113,113,0.75)", fontSize: "12px", cursor: "pointer",
    padding: "2px 0",
  },

  /* Error */
  errorBox: {
    padding: "12px 16px", borderRadius: "10px",
    background: "rgba(248,113,113,0.12)",
    border: "1px solid rgba(248,113,113,0.3)",
    color: "#fca5a5", fontSize: "13px", lineHeight: "1.5",
  },

  /* Success */
  successBox: {
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: "12px", padding: "28px 20px", borderRadius: "14px",
    background: "rgba(52,211,153,0.08)",
    border: "1px solid rgba(52,211,153,0.25)",
    marginBottom: "4px",
    animation: "successSlide 0.35s ease forwards",
    textAlign: "center",
  },
  successCheck: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "48px", height: "48px", borderRadius: "50%",
    background: "rgba(52,211,153,0.15)",
    border: "1.5px solid rgba(52,211,153,0.4)",
    color: "#34d399", fontSize: "22px", fontWeight: "700",
  },
  successTitle: { fontSize: "17px", fontWeight: "700", color: "#6ee7b7", marginBottom: "2px" },
  successSub: { fontSize: "13px", color: "rgba(148,163,184,0.8)" },
  successActions: { display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginTop: "8px" },
  addAnotherBtn: {
    padding: "10px 20px", borderRadius: "10px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#e2e8f0", fontSize: "13px", fontWeight: "500", cursor: "pointer",
  },
  dashBtn: {
    padding: "10px 20px", borderRadius: "10px",
    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
    border: "none", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer",
    boxShadow: "0 4px 16px rgba(124,58,237,0.35)",
  },

  /* Submit */
  submitBtn: {
    width: "100%", height: "50px", borderRadius: "12px",
    background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
    color: "#fff", fontSize: "15px", fontWeight: "600",
    border: "none", cursor: "pointer",
    boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    marginTop: "4px",
  },
  loadingRow: { display: "flex", alignItems: "center", gap: "10px" },
  spinnerEl: { display: "inline-block", flexShrink: 0 },
};

export default AddExpense;
