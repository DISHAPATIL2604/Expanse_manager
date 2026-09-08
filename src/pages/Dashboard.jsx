// src/pages/Dashboard.jsx
// Simple protected dashboard shown after successful authentication.

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  // Display name falls back to email if displayName isn't set
  const displayName = currentUser?.displayName || currentUser?.email || "User";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutUser();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      setLoggingOut(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background */}
      <div style={styles.bg} />
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      {/* Navbar */}
      <nav style={styles.nav} className="dashboard-nav">
        <div style={styles.navBrand}>
          <div style={styles.navLogo}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <span style={styles.navTitle}>AuthApp</span>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{ ...styles.logoutBtn, opacity: loggingOut ? 0.6 : 1 }}
          className="logout-btn"
        >
          {loggingOut ? "Signing out…" : "Logout"}
        </button>
      </nav>

      {/* Main content */}
      <main style={styles.main}>
        {/* Welcome card */}
        <div style={styles.card} className="dash-card">
          {/* Avatar */}
          <div style={styles.avatar}>{initials}</div>

          <h1 style={styles.greeting}>
            Welcome back,{" "}
            <span style={styles.name}>{displayName}</span>
          </h1>
          <p style={styles.subtitle}>You're successfully logged in to your account.</p>

          {/* Info pills */}
          <div style={styles.pills}>
            <div style={styles.pill}>
              <span style={styles.pillDot} />
              <span>{currentUser?.email}</span>
            </div>
            {currentUser?.emailVerified !== undefined && (
              <div style={{ ...styles.pill, borderColor: currentUser.emailVerified ? "rgba(52,211,153,0.3)" : "rgba(251,191,36,0.3)" }}>
                <span style={{ ...styles.pillDot, background: currentUser.emailVerified ? "#34d399" : "#fbbf24" }} />
                <span>{currentUser.emailVerified ? "Email verified" : "Email not verified"}</span>
              </div>
            )}
          </div>


          {/* ── Actions ── */}
          <div style={styles.actions}>
            <Link to="/add-expense" style={styles.addExpenseBtn} className="add-expense-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Expense
            </Link>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes blobPulse1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(30px, -20px) scale(1.08); }
        }
        @keyframes blobPulse2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-20px, 30px) scale(1.05); }
        }
        @keyframes dashFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dash-card { animation: dashFadeIn 0.5s ease forwards; }

        .logout-btn:hover:not(:disabled) {
          background: rgba(248, 113, 113, 0.15) !important;
          border-color: rgba(248, 113, 113, 0.5) !important;
          color: #fca5a5 !important;
        }
        .logout-btn { transition: all 0.2s ease; }

        @media (max-width: 480px) {
          .dash-card { padding: 32px 24px !important; }
        }
        @media (max-width: 600px) {
          .dashboard-nav { padding: 0 20px !important; }
        }

        .add-expense-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(124,58,237,0.55) !important;
        }
        .add-expense-btn:active { transform: translateY(0); }
        .add-expense-btn { transition: transform 0.2s ease, box-shadow 0.2s ease; }
      `}</style>
    </div>
  );
};

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
  bg: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(15,12,41,0.9) 0%, rgba(48,43,99,0.85) 50%, rgba(36,36,62,0.9) 100%)",
    zIndex: 0,
  },
  blob1: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
    top: "-100px",
    left: "-150px",
    animation: "blobPulse1 8s ease-in-out infinite",
    zIndex: 0,
  },
  blob2: {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)",
    bottom: "-80px",
    right: "-100px",
    animation: "blobPulse2 10s ease-in-out infinite",
    zIndex: 0,
  },
  nav: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "64px",
    padding: "0 40px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    background: "rgba(255,255,255,0.04)",
  },
  navBrand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  navLogo: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 10px rgba(124,58,237,0.4)",
  },
  navTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#f1f5f9",
    letterSpacing: "-0.01em",
  },
  logoutBtn: {
    padding: "8px 18px",
    borderRadius: "10px",
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "rgba(203,213,225,0.85)",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },
  main: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 64px)",
    padding: "40px 20px",
  },
  card: {
    width: "100%",
    maxWidth: "480px",
    padding: "48px 44px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.13)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.08) inset",
    textAlign: "center",
  },
  avatar: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    fontWeight: "700",
    color: "#fff",
    margin: "0 auto 24px",
    boxShadow: "0 4px 20px rgba(124,58,237,0.45)",
    letterSpacing: "0.02em",
  },
  greeting: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: "10px",
    letterSpacing: "-0.02em",
    lineHeight: "1.3",
  },
  name: {
    background: "linear-gradient(90deg, #a78bfa, #818cf8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: "14px",
    color: "rgba(148,163,184,0.8)",
    marginBottom: "28px",
  },
  pills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    justifyContent: "center",
    marginBottom: "28px",
  },
  pill: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 14px",
    borderRadius: "100px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    fontSize: "12px",
    color: "rgba(203,213,225,0.85)",
  },
  pillDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#34d399",
    flexShrink: 0,
  },
  actions: {
    marginTop: "24px",
    display: "flex",
    justifyContent: "center",
    gap: "12px",
  },
  addExpenseBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "13px 28px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    textDecoration: "none",
    boxShadow: "0 4px 20px rgba(124,58,237,0.38)",
    letterSpacing: "0.02em",
  },
};

export default Dashboard;
