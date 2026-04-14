import React from 'react';
import { authService } from '../../services/auth';
import Header from '../../components/Header/Header';
import ChatInterface from '../../components/ChatInterface/ChatInterface';
import styles from './Dashboard.module.scss';

interface DashboardProps {
  onLogout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    onLogout?.();
  };

  return (
    <div className={styles.dashboard}>
      <Header
        isAuthenticated={true}
        userName={user?.name}
        userEmail={user?.email}
        onLogout={handleLogout}
      />
      <main className={styles.main}>
        <ChatInterface />
      </main>
    </div>
  );
};

export default Dashboard;
