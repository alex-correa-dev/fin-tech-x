import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Header from '../../components/Header/Header';
import styles from './Home.module.scss';
import robotImage from '../../assets/images/robot.png';

const Home: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`${styles['home-page']} ${theme === 'dark' ? styles['-dark'] : styles['-light']}`}
    >
      <Header isAuthenticated={false} />

      <div className={styles.hero}>
        <div className={styles['robot-container']}>
          <img src={robotImage} alt="AI Robot" className={styles['robot-image']} />
        </div>

        <h1 className={`${styles.title} ${theme === 'dark' ? styles['-dark'] : styles['-light']}`}>
          Unlock the Power Of Future AI
        </h1>

        <p className={styles.subtitle}>
          Chat with the smartest AI Future Experience power of AI with us
        </p>
      </div>
    </div>
  );
};

export default Home;
