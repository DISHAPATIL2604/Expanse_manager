// src/components/AuthCard.jsx
// The shared glassmorphism card shell used by both Login and Signup pages.
// Also renders the full-screen background with gradient overlay.

const AuthCard = ({ children }) => {
  return (
    <div style={styles.page}>
      {/* Full-screen background with scenic image + gradient overlay */}
      <div style={styles.backgroundOverlay} />

      {/* Subtle animated blobs for depth */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      {/* Glassmorphism card */}
      <div style={styles.card} className="auth-card">
        {children}
      </div>

      <style>{`
        /* Blob pulse animations */
        @keyframes blobPulse1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(30px, -20px) scale(1.08); }
        }
        @keyframes blobPulse2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(-20px, 30px) scale(1.05); }
        }

        /* Card entrance animation */
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .auth-card {
          animation: cardFadeIn 0.5s ease forwards;
        }

        /* Responsive card widths */
        @media (max-width: 480px) {
          .auth-card {
            width: 92vw !important;
            padding: 32px 24px !important;
            border-radius: 20px !important;
          }
        }
        @media (min-width: 481px) and (max-width: 768px) {
          .auth-card {
            width: 420px !important;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    // Scenic nature background from Unsplash (no auth needed, free to use)
    backgroundImage:
      "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80&fm=webp')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  backgroundOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(15, 12, 41, 0.88) 0%, rgba(48, 43, 99, 0.82) 50%, rgba(36, 36, 62, 0.88) 100%)",
    zIndex: 0,
  },
  blob1: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(124, 58, 237, 0.22) 0%, transparent 70%)",
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
    background: "radial-gradient(circle, rgba(79, 70, 229, 0.18) 0%, transparent 70%)",
    bottom: "-80px",
    right: "-100px",
    animation: "blobPulse2 10s ease-in-out infinite",
    zIndex: 0,
  },
  card: {
    position: "relative",
    zIndex: 1,
    width: "460px",
    padding: "48px 44px",
    borderRadius: "24px",
    background: "rgba(255, 255, 255, 0.07)",
    border: "1px solid rgba(255, 255, 255, 0.13)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow:
      "0 8px 32px rgba(0, 0, 0, 0.4), 0 1px 0 rgba(255,255,255,0.08) inset",
  },
};

export default AuthCard;
