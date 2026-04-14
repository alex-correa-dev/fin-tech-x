import React from 'react';
import Icon from '../Icon/Icon';
import { useToast } from '../../contexts/ToastContext';
import styles from './Message.module.scss';
import roboAvatarImage from '../../assets/images/robot-avatar.png';
import iaAvatarImage from '../../assets/images/ia-avatar.png';

interface MessageProps {
  message: string;
  isUser: boolean;
  userName?: string;
  timestamp?: Date;
}

const Message: React.FC<MessageProps> = ({ message, isUser, userName, timestamp }) => {
  const { showToast } = useToast();

  const formatTime = (date?: Date) => {
    if (!date) {
      return '';
    }

    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      showToast('Texto copiado! ✅', 'success');
    } catch (err) {
      showToast('Erro ao copiar texto', 'error');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        text: message,
      });
    }
  };

  if (isUser) {
    return (
      <div className={styles['message-user']}>
        <div className={styles.content}>
          <div className={styles.row}>
            <div className={styles.avatar}>
              <img src={roboAvatarImage} alt="Usuário" />
            </div>
            <p className={styles.text} data-testid="message-text">
              {message}
            </p>
            <Icon name="write" size={16} color="#A3A3A8" />
          </div>
          <div className={styles.footer}>
            <span className={styles.time}>{formatTime(timestamp)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['message-assistant']}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            <img src={iaAvatarImage} alt="AI" />
          </div>
          <div className={styles.actions}>
            <button onClick={handleCopy} className={styles.actionBtn} title="Copiar">
              <Icon name="copy" size={16} color="#A3A3A8" />
            </button>
            <button onClick={handleShare} className={styles.actionBtn} title="Compartilhar">
              <Icon name="share" size={16} color="#A3A3A8" />
            </button>
          </div>
        </div>
        <p className={styles.text}>{message}</p>
        <div className={styles.footer}>
          <span className={styles.time}>{formatTime(timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

export default Message;
