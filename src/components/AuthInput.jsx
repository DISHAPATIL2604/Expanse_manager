// src/components/AuthInput.jsx
// A reusable input component for the auth forms with label, icon, and optional password toggle.

import { useState } from "react";

const EyeIcon = ({ open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const AuthInput = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  autoComplete,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div style={styles.wrapper}>
      {label && <label style={styles.label}>{label}</label>}
      <div style={styles.inputContainer}>
        {/* Optional leading icon */}
        {icon && <span style={styles.leadingIcon}>{icon}</span>}

        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          style={{
            ...styles.input,
            paddingLeft: icon ? "44px" : "16px",
            paddingRight: isPassword ? "44px" : "16px",
          }}
          className="auth-input"
        />

        {/* Password visibility toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            style={styles.toggleBtn}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <EyeIcon open={showPassword} />
          </button>
        )}
      </div>

      {/* Inline CSS for hover/focus effects that require pseudo-selectors */}
      <style>{`
        .auth-input {
          transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }
        .auth-input:focus {
          outline: none;
          border-color: rgba(167, 139, 250, 0.7) !important;
          background: rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2);
        }
        .auth-input::placeholder {
          color: rgba(148, 163, 184, 0.6);
        }
        .auth-input:-webkit-autofill,
        .auth-input:-webkit-autofill:hover,
        .auth-input:-webkit-autofill:focus {
          -webkit-text-fill-color: #f1f5f9;
          -webkit-box-shadow: 0 0 0px 1000px rgba(30, 20, 60, 0.9) inset;
          transition: background-color 5000s ease-in-out 0s;
        }

        /* Suppress native browser password-reveal buttons (Chrome, Edge, Safari)
           so only our custom eye toggle is visible */
        .auth-input::-ms-reveal,
        .auth-input::-ms-clear {
          display: none;
        }
        .auth-input::-webkit-credentials-auto-fill-button {
          visibility: hidden;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "rgba(203, 213, 225, 0.9)",
    letterSpacing: "0.03em",
  },
  inputContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  leadingIcon: {
    position: "absolute",
    left: "14px",
    color: "rgba(148, 163, 184, 0.7)",
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
    zIndex: 1,
  },
  input: {
    width: "100%",
    height: "48px",
    background: "rgba(255, 255, 255, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "12px",
    color: "#f1f5f9",
    fontSize: "15px",
    fontWeight: "400",
  },
  toggleBtn: {
    position: "absolute",
    right: "14px",
    background: "transparent",
    border: "none",
    color: "rgba(148, 163, 184, 0.7)",
    display: "flex",
    alignItems: "center",
    padding: "4px",
    cursor: "pointer",
    transition: "color 0.2s ease",
    zIndex: 1,
  },
};

export default AuthInput;
