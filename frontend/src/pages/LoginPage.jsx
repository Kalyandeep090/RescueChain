import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ShieldAlert, Mail, Lock, LogIn, AlertCircle, ArrowRight } from 'lucide-react';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error', err);
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.logoBadge}>
            <ShieldAlert size={40} color="#ef4444" />
          </div>
          <h1>RescueChain</h1>
          <p>Emergency Response Management System</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {error && (
            <div className={styles.errorBanner}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className={styles.inputWrapper}>
            <label>Email Address</label>
            <div className={styles.inputIconGroup}>
              <Mail size={18} className={styles.inputIcon} />
              <input 
                type="email" 
                placeholder=" " 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <label>Password</label>
            <div className={styles.inputIconGroup}>
              <Lock size={18} className={styles.inputIcon} />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>

          <button type="submit" className={styles.signInButton} disabled={loading}>
            {loading ? 'Authenticating...' : <><LogIn size={20} /> Sign In to Command Center</>}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Don't have an account? {' '}
            <Link to="/signup" style={{ color: '#3b82f6', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Create Account <ArrowRight size={14} />
            </Link>
          </p>
        </div>

        <div className={styles.loginFooter}>
          <p>© 2026 RescueChain Platform. Authorized Access Only.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
