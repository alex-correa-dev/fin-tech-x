import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './ThemeToggle.module.scss';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`${styles.toggle} ${theme === 'dark' ? styles.dark : styles.light}`}
      onClick={toggleTheme}
      aria-label="Alternar tema"
    >
      <div className={styles.toggleSlider}>
        <span className={styles.icon}>
          {theme === 'light' ? '☀️' : '🌙'}
        </span>
      </div>
    </button>
  );
};

export default ThemeToggle;