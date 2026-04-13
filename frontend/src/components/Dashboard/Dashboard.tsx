import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import ChatInterface from '../ChatInterface/ChatInterface';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import styles from './Dashboard.module.scss';

interface DashboardProps {
  onLogout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    
    onLogout?.();
    navigate('/login');
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles['header-content']}>
          <div className={styles.logo}>
            <span className={styles.icon}>💰</span>
            <h1 className={styles.title}>FinTechX</h1>
            <span className={styles.badge}>AI Powered</span>
          </div>
          <div className={styles['user-area']}>
            <div className={styles.info}>
              <span className={styles.name}>{user?.name || 'User'}</span>
              <span className={styles.email}>{user?.email}</span>
            </div>
            <ThemeToggle />
            <button onClick={handleLogout} className={styles['logout-btn']}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <ChatInterface />
      </main>
    </div>
  );
};

export default Dashboard;