import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import useAuthStore from "../../store/useAuthStore";
import logo from "../../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);

  /* ================= AUTO REDIRECT IF ALREADY LOGGED IN ================= */
  useEffect(() => {
    if (user) {
      navigate("/"); // AppNavigator decides layout based on role
    }
  }, [user, navigate]);

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleSuccess = async (response) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: response.credential }),
        }
      );

      if (!res.ok) {
        alert("User not authorized");
        return;
      }

      const data = await res.json();

      // data.user.role must be 1 | 2 | 3
      login(data.user, data.token);

      navigate("/"); // single entry point
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Welcome Back!</h2>

        <img src={logo} alt="BIT Logo" style={styles.logo} />

        <h3 style={styles.portalTitle}>STUDENT INFORMATION PORTAL</h3>
        <div style={styles.divider}></div>

        <GoogleSignInButton onSuccess={handleGoogleSuccess} />

        <p style={styles.footerText}>
          Sign in with your institutional Google account
        </p>
      </div>
    </div>
  );
};

export default Login;


const styles = {
  page: {
    height: "100vh",               // 🔹 instead of minHeight
    overflow: "hidden",            // 🔹 removes scroll
    background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 60%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    backgroundColor: "#ffffff",
    width: "100%",
    maxWidth: "500px",              // 🔹 slightly smaller
    padding: "32px",                // 🔹 reduced height
    borderRadius: "14px",
    boxShadow: "0 16px 32px rgba(0,0,0,0.12)",
    textAlign: "center",
  },

  heading: {
    color: "#455a64",
    fontSize: "24px",               // 🔹 slightly smaller
    fontWeight: "600",
    marginBottom: "18px",
  },

  logo: {
    width: "240px",                 // 🔹 reduced a bit
    marginBottom: "22px",
  },

  portalTitle: {
    color: "#37474f",
    fontSize: "18px",
    fontWeight: "500",
    marginBottom: "12px",
  },

  divider: {
    width: "52px",
    height: "4px",
    backgroundColor: "#4285f4",
    margin: "0 auto 22px",
    borderRadius: "4px",
  },

  footerText: {
    fontSize: "13px",
    color: "#777",
    marginTop: "10px",
  },

  button: {
    width: "100%",
    padding: "10px",                // 🔹 reduced
    marginBottom: "8px",
    backgroundColor: "#4285f4",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },

  disabledButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#ccc",
    color: "#666",
    border: "none",
    borderRadius: "8px",
    cursor: "not-allowed",
  },
};

