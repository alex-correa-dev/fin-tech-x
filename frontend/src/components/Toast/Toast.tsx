import React, { useEffect } from 'react';
import styles from './Toast.module.scss';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`} data-testid="mock-toast" data-type={type}>
      <span className={styles.icon}>
        {type === 'success' && '✅'}
        {type === 'error' && '❌'}
        {type === 'info' && 'ℹ️'}
      </span>
      <span className={styles.message}>{message}</span>
    </div>
  );
};

export default Toast;
