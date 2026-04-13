import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth';
import styles from './Login.module.scss';

interface LoginProps {
  onLogin?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login({ email, password });
      
      onLogin?.();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['login-page']}>
      <div className={styles['login-card']}>
        <div className={styles.header}>
          <h1 className={styles.title}>💰 FinTechX</h1>
          <p className={styles.subtitle}>Welcome back!</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles['error-message']}>{error}</div>}

          <div className={styles['field-group']}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className={styles['field-group']}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className={styles['submit-btn']} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className={styles.footer}>
            Don't have an account? <Link className={styles.link} to="/register">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;