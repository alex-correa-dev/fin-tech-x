import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth';
import Input from '../../components/Input/Input';
import Icon from '../../components/Icon/Icon';
import { sanitizeEmail, sanitizeString, isValidEmail, isValidPassword } from '../../utils/sanitize';
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setEmail(rawValue);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedPassword = sanitizeString(password);

    if (!isValidEmail(sanitizedEmail)) {
      setError('Por favor, insira um e-mail válido');
      return;
    }

    if (!isValidPassword(sanitizedPassword)) {
      setError('A senha deve ter entre 6 e 100 caracteres');
      return;
    }

    setLoading(true);

    try {
      await authService.login({
        email: sanitizedEmail,
        password: sanitizedPassword,
      });
      onLogin?.();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className={styles['login-page']}>
      <div className={styles['login-card']}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleGoBack}>
            <Icon name="arrow-left" size={24} color="#666" />
          </button>
          <h1 className={styles.title}>💰 FinTechX</h1>
          <p className={styles.subtitle}>Bem-vindo de volta!</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles['error-message']}>{error}</div>}

          <Input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="E-mail"
            disabled={loading}
            required
            iconLeft="email"
            iconRight="write"
          />

          <Input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Senha"
            disabled={loading}
            required
            iconLeft="lock"
            iconRight="write"
          />

          <button type="submit" className={styles['submit-btn']} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className={styles.footer}>
            Não tem uma conta?{' '}
            <Link className={styles.link} to="/register">
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
