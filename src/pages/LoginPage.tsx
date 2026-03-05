import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import { loginUser, clearError } from '../store/authSlice';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/game');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    dispatch(loginUser({ username, password }));
  };

  return (
    <div className="login-page" style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <h1 style={styles.logo}>♠ AllPoker</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.field}>
            <label htmlFor="username" style={styles.label}>
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              style={styles.input}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={styles.input}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={styles.link}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0e17 0%, #1a1a2e 50%, #16213e 100%)',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
  },
  logoArea: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logo: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#e2b96f',
    margin: 0,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    marginTop: '8px',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '13px',
    fontWeight: 500,
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #e2b96f, #c9952e)',
    color: '#0a0e17',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
  },
  error: {
    padding: '10px 14px',
    borderRadius: '8px',
    background: 'rgba(220,53,69,0.15)',
    border: '1px solid rgba(220,53,69,0.3)',
    color: '#ff6b6b',
    fontSize: '13px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
  },
  link: {
    color: '#e2b96f',
    textDecoration: 'none',
    fontWeight: 500,
  },
};

export default LoginPage;
