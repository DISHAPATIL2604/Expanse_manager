// src/pages/Signup.jsx
// Sign up page with name, email, password, confirm password, and Firebase user creation.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import { signUpUser, getFriendlyErrorMessage } from "../services/authService";

// SVG icons
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,12 2,6"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const Signup = () => {
  const navigate = useNavigate();

  // Form state
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [confirmPassword, setConfirm] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    if (!name.trim())    return "Please enter your full name.";
    if (!email.trim())   return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
    if (!password)       return "Please enter a password.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  // ── Signup submit ─────────────────────────────────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);
    try {
      await signUpUser(name.trim(), email.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      setError(getFriendlyErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logoMark}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        <h1 style={styles.heading}>Create Account</h1>
        <p style={styles.subtitle}>Create your account to get started</p>
      </div>

      {/* Error alert */}
      {error && <div style={styles.alertError}>{error}</div>}

      {/* Form */}
      <form onSubmit={handleSignup} style={styles.form} noValidate>
        <AuthInput
          label="Full name"
          type="text"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<UserIcon />}
          autoComplete="name"
          required
        />

        <AuthInput
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<MailIcon />}
          autoComplete="email"
          required
        />

        <AuthInput
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<LockIcon />}
          autoComplete="new-password"
          required
        />

        <AuthInput
          label="Confirm password"
          type="password"
          placeholder="Repeat your password"
          value={confirmPassword}
          onChange={(e) => setConfirm(e.target.value)}
          icon={<LockIcon />}
          autoComplete="new-password"
          required
        />

        {/* Password strength hint */}
        {password.length > 0 && (
          <PasswordStrength password={password} />
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
          className="submit-btn"
        >
          {loading ? (
            <span style={styles.loadingSpinner}>
              <span style={styles.spinner} className="spinner" />
              Creating account…
            </span>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {/* Switch to login */}
      <p style={styles.switchText}>
        Already have an account?{" "}
        <Link to="/login" style={styles.switchLink} className="switch-link">
          Login
        </Link>
      </p>

      <style>{`
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(124, 58, 237, 0.55) !important;
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn { transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease; }
        .switch-link:hover { color: #c4b5fd !important; text-decoration: underline; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
      `}</style>
    </AuthCard>
  );
};

// ── Password strength indicator ───────────────────────────────────────────────
const PasswordStrength = ({ password }) => {
  const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 6)  score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const score     = getStrength(password);
  const levels    = ["", "Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const colors    = ["", "#f87171", "#f87171", "#fbbf24", "#34d399", "#34d399"];
  const widths    = ["0%", "20%", "40%", "60%", "80%", "100%"];

  return (
    <div style={{ marginTop: "-8px" }}>
      <div style={{
        height: "3px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "2px",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: widths[score],
          background: colors[score],
          borderRadius: "2px",
          transition: "width 0.3s ease, background 0.3s ease",
        }} />
      </div>
      <span style={{ fontSize: "11px", color: colors[score], marginTop: "4px", display: "block" }}>
        {levels[score]}
      </span>
    </div>
  );
};

const styles = {
  header: {
    textAlign: "center",
    marginBottom: "28px",
  },
  logoMark: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
    marginBottom: "20px",
    boxShadow: "0 4px 20px rgba(124, 58, 237, 0.4)",
  },
  heading: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: "8px",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "14px",
    color: "rgba(148, 163, 184, 0.85)",
    fontWeight: "400",
  },
  alertError: {
    padding: "12px 16px",
    borderRadius: "10px",
    background: "rgba(248, 113, 113, 0.12)",
    border: "1px solid rgba(248, 113, 113, 0.3)",
    color: "#fca5a5",
    fontSize: "13px",
    marginBottom: "20px",
    lineHeight: "1.5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  submitBtn: {
    width: "100%",
    height: "50px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    letterSpacing: "0.02em",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(124, 58, 237, 0.35)",
    marginTop: "4px",
  },
  loadingSpinner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  spinner: {},
  switchText: {
    textAlign: "center",
    fontSize: "14px",
    color: "rgba(148, 163, 184, 0.75)",
    marginTop: "24px",
  },
  switchLink: {
    color: "#a78bfa",
    fontWeight: "600",
    transition: "color 0.2s ease",
  },
};

export default Signup;
