import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import styles from './Header.module.scss';

interface HeaderProps {
  isAuthenticated?: boolean;
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isAuthenticated = false,
  userName,
  userEmail,
  onLogout,
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    onLogout?.();
    navigate('/');
  };

  return (
    <header
      data-testid="header-component"
      className={`${styles['main-header']} ${theme === 'dark' ? styles['-dark'] : styles['-light']}`}
    >
      <div className={styles.container}>
        <div className={styles.logo} data-testid="header-logo">
          <span className={styles.icon}>💰</span>
          <span className={styles.text}>FinTechX</span>
          {isAuthenticated && (
            <span className={styles.badge} data-testid="header-badge">
              AI Powered
            </span>
          )}
        </div>

        <div className={styles.actions}>
          <ThemeToggle />

          {isAuthenticated ? (
            <div className={styles['user-area']} data-testid="header-user-area">
              <div className={styles.info}>
                <span className={styles.name} data-testid="header-user-name">
                  {userName || 'User'}
                </span>
                <span className={styles.email} data-testid="header-user-email">
                  {userEmail}
                </span>
              </div>
              <button
                className={styles['logout-btn']}
                onClick={handleLogoutClick}
                data-testid="header-logout-btn"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              className={styles['login-btn']}
              onClick={handleLoginClick}
              data-testid="header-login-btn"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
