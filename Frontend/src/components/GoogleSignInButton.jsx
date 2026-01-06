
import React, { useEffect, useRef, useState } from "react";

const styles = {
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "16px",
  },
  errorBox: {
    color: "#b00020",
    backgroundColor: "#fdecea",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "14px",
    textAlign: "center",
  },
};

const GoogleSignInButton = ({ onSuccess, onFailure }) => {
  const buttonRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google?.accounts?.id) {
        renderButton();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = renderButton;
      script.onerror = () => {
        setError("Failed to load Google Sign-In");
      };
      document.head.appendChild(script);
    };

    const renderButton = () => {
      if (!buttonRef.current || !window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: (response) => {
          // IMPORTANT: send credential to backend, NOT decoded payload
          onSuccess(response);
        },
        ux_mode: "popup",
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 300,
      });
    };

    loadGoogleScript();
  }, []);

  if (error) {
    return <div style={styles.errorBox}>{error}</div>;
  }

  return <div ref={buttonRef} style={styles.buttonContainer} />;
};

export default GoogleSignInButton;
