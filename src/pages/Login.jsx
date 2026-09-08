// src/pages/Login.jsx
// Login page with email/password auth, remember me, forgot password, and form validation.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import { loginUser, resetPassword, getFriendlyErrorMessage } from "../services/authService";

// Simple SVG icons
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

const Login = () => {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // UI state
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    if (!email.trim()) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
    if (!password) return "Please enter your password.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  // ── Login submit ──────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);
    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(getFriendlyErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot password ───────────────────────────────────────────────────────
  const handleForgotPassword = async () => {
    setError("");
    setSuccess("");
    if (!email.trim()) return setError("Enter your email above, then click 'Forgot password?'");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email address.");

    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess("Password reset email sent! Check your inbox.");
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
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <h1 style={styles.heading}>Welcome Back</h1>
        <p style={styles.subtitle}>Login to continue to your account</p>
      </div>

      {/* Error / Success alerts */}
      {error   && <div style={styles.alertError}>{error}</div>}
      {success && <div style={styles.alertSuccess}>{success}</div>}

      {/* Form */}
      <form onSubmit={handleLogin} style={styles.form} noValidate>
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
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {/* Remember me + Forgot password row */}
        <div style={styles.row}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={styles.checkbox}
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={loading}
            style={styles.forgotBtn}
            className="forgot-btn"
          >
            Forgot password?
          </button>
        </div>

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
              Logging in…
            </span>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {/* Switch to sign up */}
      <p style={styles.switchText}>
        Don't have an account?{" "}
        <Link to="/signup" style={styles.switchLink} className="switch-link">
          Sign up
        </Link>
      </p>

      {/* Hover/animation styles */}
      <style>{`
        .forgot-btn:hover { color: rgba(167, 139, 250, 1) !important; }
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

const styles = {
  header: {
    textAlign: "center",
    marginBottom: "32px",
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
  alertSuccess: {
    padding: "12px 16px",
    borderRadius: "10px",
    background: "rgba(52, 211, 153, 0.12)",
    border: "1px solid rgba(52, 211, 153, 0.3)",
    color: "#6ee7b7",
    fontSize: "13px",
    marginBottom: "20px",
    lineHeight: "1.5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "-4px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "rgba(148, 163, 184, 0.85)",
    cursor: "pointer",
    userSelect: "none",
  },
  checkbox: {
    accentColor: "#7c3aed",
    width: "15px",
    height: "15px",
    cursor: "pointer",
  },
  forgotBtn: {
    background: "transparent",
    fontSize: "13px",
    color: "rgba(167, 139, 250, 0.8)",
    cursor: "pointer",
    fontWeight: "500",
    transition: "color 0.2s ease",
    padding: "0",
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
    marginTop: "28px",
  },
  switchLink: {
    color: "#a78bfa",
    fontWeight: "600",
    transition: "color 0.2s ease",
  },
};

export default Login;
