import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './ThemeToggle.module.scss';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const toggleClass = `${styles['theme-toggle']} ${theme === 'dark' ? styles['-dark'] : styles['-light']}`;

  return (
    <button
      className={toggleClass}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <div className={styles.slider}>
        <span className={styles.icon}>
          {theme === 'light' ? '☀️' : '🌙'}
        </span>
      </div>
    </button>
  );
};

export default ThemeToggle;