import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth';
import Input from '../../components/Input/Input';
import Icon from '../../components/Icon/Icon';
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
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
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
          <button className={styles.backButton} onClick={handleGoBack}>
            <Icon name="arrow-left" size={24} color="#666" />
          </button>
          <h1 className={styles.title}>💰 FinTechX</h1>
          <p className={styles.subtitle}>Crie sua conta gratuita</p>
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
            iconRight="write"
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
            iconRight="write"
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
            iconRight="write"
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
            iconRight="write"
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
