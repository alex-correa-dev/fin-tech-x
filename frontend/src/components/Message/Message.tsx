import React from 'react';
import styles from './Message.module.scss';

interface MessageProps {
  message: string;
  isUser: boolean;
  userName?: string;
  timestamp?: Date;
}

const Message: React.FC<MessageProps> = ({ message, isUser, userName, timestamp }) => {
  const formatTime = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`${styles.message} ${isUser ? styles.user : styles.assistant}`}>
      <div className={styles.avatar}>
        {isUser ? '👤' : '🤖'}
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.name}>
            {isUser ? userName || 'Você' : 'FinTechX AI'}
          </span>
          {timestamp && (
            <span className={styles.time}>
              {formatTime(timestamp)}
            </span>
          )}
        </div>
        <p className={styles.text}>{message}</p>
      </div>
    </div>
  );
};

export default Message;