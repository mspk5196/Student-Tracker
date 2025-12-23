import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import GoogleSignInButton from '../../components/GoogleSignInButton';
import logo from '../assets/logo.png';
import useUserStore from '../../store/useUserStore';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleSuccess = async (userData) => {
    try {
      const user = await login(userData);
      setUser(user);

      switch (user.role) {
        case 'STUDENT':
          navigate('/student-dashboard');
          break;
        case 'FACULTY':
          navigate('/faculty-dashboard');
          break;
        case 'ADMIN':
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google login failed:', error);
  };

  // 🔹 Dummy login handler
  const handleDummyLogin = (role) => {
    const dummyUser = {
      name: 'Test User',
      email: 'test@bitsathy.ac.in',
      role,
    };

    setUser(dummyUser);

    if (role === 'STUDENT') navigate('/student-dashboard');
    else if (role === 'FACULTY') navigate('/faculty-dashboard');
    else if (role === 'ADMIN') navigate('/admin-dashboard');
    // else → stay on login page
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Welcome Back!</h2>

        <img src={logo} alt="BIT" style={styles.logo} />

        <h3 style={styles.portalTitle}>STUDENT INFORMATION PORTAL</h3>

        <div style={styles.divider}></div>

        <GoogleSignInButton
          onSuccess={handleGoogleSuccess}
          onFailure={handleGoogleFailure}
        />

        <p style={styles.footerText}>
          Sign in with your BIT Google account
        </p>

        {/* Dummy Login Buttons */}
        <div style={styles.dummyContainer}>
          <p style={styles.dummyTitle}>Dummy Login (Testing)</p>

          <button style={styles.button} onClick={() => handleDummyLogin('STUDENT')}>
            Login as Student
          </button>

          <button style={styles.button} onClick={() => handleDummyLogin('FACULTY')}>
            Login as Faculty
          </button>

          <button style={styles.button} onClick={() => handleDummyLogin('ADMIN')}>
            Login as Admin
          </button>

          <button style={styles.disabledButton}>
            Unknown Role (Stay Here)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#eff4f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: '420px',
    padding: '32px',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  heading: {
    color: '#6c757d',
    fontSize: '24px',
    marginBottom: '24px',
  },
  logo: {
    width: '240px',
    marginBottom: '24px',
  },
  portalTitle: {
    color: '#546e7a',
    fontSize: '18px',
    marginBottom: '12px',
  },
  divider: {
    width: '40px',
    height: '3px',
    backgroundColor: '#4285f4',
    margin: '0 auto 24px',
    borderRadius: '2px',
  },
  footerText: {
    fontSize: '13px',
    color: '#999',
    marginTop: '12px',
  },
  dummyContainer: {
    marginTop: '24px',
    padding: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
  },
  dummyTitle: {
    fontSize: '14px',
    marginBottom: '12px',
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    padding: '10px',
    marginBottom: '8px',
    backgroundColor: '#4285f4',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  disabledButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#ccc',
    color: '#666',
    border: 'none',
    borderRadius: '6px',
    cursor: 'not-allowed',
  },
};
