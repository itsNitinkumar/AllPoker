import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import { registerUser, clearError } from '../store/authSlice';

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim())
      return;

    const result = await dispatch(
      registerUser({
        first_name: firstName,
        last_name: lastName,
        email_address: email,
        password,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      setSuccess('Registration successful! Redirecting to login…');
      setTimeout(() => navigate('/login'), 1500);
    }
  };

  return (
    <div className="register-page" style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <h1 style={styles.logo}>♠ AllPoker</h1>
          <p style={styles.subtitle}>Create your account</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          <div style={styles.row}>
            <div style={styles.field}>
              <label htmlFor="firstName" style={styles.label}>
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                style={styles.input}
                autoFocus
              />
            </div>
            <div style={styles.field}>
              <label htmlFor="lastName" style={styles.label}>
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              style={styles.input}
              autoComplete="email"
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="regPassword" style={styles.label}>
              Password
            </label>
            <input
              id="regPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              style={styles.input}
              autoComplete="new-password"
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
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Sign In
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
    maxWidth: '440px',
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
    gap: '18px',
  },
  row: {
    display: 'flex',
    gap: '12px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
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
    marginTop: '4px',
  },
  error: {
    padding: '10px 14px',
    borderRadius: '8px',
    background: 'rgba(220,53,69,0.15)',
    border: '1px solid rgba(220,53,69,0.3)',
    color: '#ff6b6b',
    fontSize: '13px',
  },
  success: {
    padding: '10px 14px',
    borderRadius: '8px',
    background: 'rgba(40,167,69,0.15)',
    border: '1px solid rgba(40,167,69,0.3)',
    color: '#51cf66',
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

export default RegisterPage;
