import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth';
import styles from './Register.module.scss';

interface RegisterProps {
  onRegister?: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');

      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');

      return;
    }

    setLoading(true);

    try {
      await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      onRegister?.();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['register-page']}>
      <div className={styles['register-card']}>
        <div className={styles.header}>
          <h1 className={styles.title}>💰 FinTechX</h1>
          <p className={styles.subtitle}>Create your free account</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles['error-message']}>{error}</div>}

          <div className={styles['field-group']}>
            <label className={styles.label} htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              name="name"
              className={styles.input}
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              disabled={loading}
            />
          </div>

          <div className={styles['field-group']}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              className={styles.input}
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className={styles['field-group']}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              className={styles.input}
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              required
              disabled={loading}
            />
          </div>

          <div className={styles['field-group']}>
            <label className={styles.label} htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              className={styles.input}
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className={styles['submit-btn']} disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <p className={styles.footer}>
            Already have an account?{' '}
            <Link className={styles.link} to="/login">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
