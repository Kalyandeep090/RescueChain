import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ShieldAlert, Mail, Lock, User, UserPlus, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import styles from './LoginPage.module.css'; // Reusing base styles

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAppContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    setError('');
    try {
      await signUp(formData.email, formData.password, formData.name);
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error', err);
      setError(err.message || 'Failed to create account. Please try again.');
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
          <h1>Join RescueChain</h1>
          <p>Create an account to join the response network</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {error && (
            <div className={styles.errorBanner}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className={styles.inputWrapper}>
            <label>Full Name</label>
            <div className={styles.inputIconGroup}>
              <User size={18} className={styles.inputIcon} />
              <input 
                name="name"
                type="text" 
                placeholder=" " 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          

          <div className={styles.inputWrapper}>
            <label>Email Address</label>
            <div className={styles.inputIconGroup}>
              <Mail size={18} className={styles.inputIcon} />
              <input 
                name="email"
                type="email" 
                placeholder=" " 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <label>Password</label>
            <div className={styles.inputIconGroup}>
              <Lock size={18} className={styles.inputIcon} />
              <input 
                name="password"
                type="password" 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <label>Confirm Password</label>
            <div className={styles.inputIconGroup}>
              <Lock size={18} className={styles.inputIcon} />
              <input 
                name="confirmPassword"
                type="password" 
                placeholder="••••••••" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <button type="submit" className={styles.signInButton} disabled={loading}>
            {loading ? 'Creating Account...' : <><UserPlus size={20} /> Create  Account</>}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Already have an account? {' '}
            <Link to="/login" style={{ color: '#3b82f6', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Sign In <ArrowRight size={14} />
            </Link>
          </p>
        </div>

        <div className={styles.loginFooter}>
          <p>© 2026 RescueChain Platform. Secure Response Network.</p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
