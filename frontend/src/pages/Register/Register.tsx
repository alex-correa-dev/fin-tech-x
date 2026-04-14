import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth';
import Input from '../../components/Input/Input';
import Icon from '../../components/Icon/Icon';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import {
  sanitizeEmail,
  sanitizeString,
  sanitizeName,
  isValidEmail,
  isValidPassword,
} from '../../utils/sanitize';
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

    const sanitizedName = sanitizeName(formData.name);
    const sanitizedEmail = sanitizeEmail(formData.email);
    const sanitizedPassword = sanitizeString(formData.password);
    const sanitizedConfirmPassword = sanitizeString(formData.confirmPassword);

    if (!sanitizedName || sanitizedName.length < 3) {
      setError('Nome deve ter no mínimo 3 caracteres');
      return;
    }

    if (!isValidEmail(sanitizedEmail)) {
      setError('Por favor, insira um e-mail válido');
      return;
    }

    if (!isValidPassword(sanitizedPassword)) {
      setError('A senha deve ter entre 6 e 100 caracteres');
      return;
    }

    if (sanitizedPassword !== sanitizedConfirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      await authService.register({
        name: sanitizedName,
        email: sanitizedEmail,
        password: sanitizedPassword,
      });

      onRegister?.();
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro durante o cadastro');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/login');
  };

  return (
    <div className={styles['register-page']}>
      <div className={styles['register-card']}>
        <div className={styles.header}>
          <div className={styles['header-left']}>
            <button className={styles.backButton} onClick={handleGoBack}>
              <Icon name="arrow-left" size={24} color="#666" />
            </button>
          </div>
          <div className={styles['header-center']}>
            <h1 className={styles.title}>💰 FinTechX</h1>
            <p className={styles.subtitle}>Crie sua conta gratuita</p>
          </div>
          <div className={styles['header-right']}>
            <ThemeToggle />
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles['error-message']}>{error}</div>}

          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nome completo"
            disabled={loading}
            required
            iconLeft="user"
          />

          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-mail"
            disabled={loading}
            required
            iconLeft="email"
          />

          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Senha (mínimo 6 caracteres)"
            disabled={loading}
            required
            iconLeft="lock"
          />

          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmar senha"
            disabled={loading}
            required
            iconLeft="lock"
          />

          <button type="submit" className={styles['submit-btn']} disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>

          <p className={styles.footer}>
            Já tem uma conta?{' '}
            <Link className={styles.link} to="/login">
              Faça login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
