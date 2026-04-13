import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import ChatInterface from '../ChatInterface/ChatInterface';
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
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>💰</span>
            <h1>FinTechX</h1>
            <span className={styles.badge}>AI Powered</span>
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user?.name || 'Usuário'}</span>
              <span className={styles.userEmail}>{user?.email}</span>
            </div>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Sair
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