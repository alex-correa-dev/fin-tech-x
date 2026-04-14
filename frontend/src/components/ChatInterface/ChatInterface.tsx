import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../../services/chat';
import Message from '../Message/Message';
import { IChatMessage } from '../../types';
import Icon from '../Icon/Icon';
import { sanitizeInput, sanitizeResponse } from '../../utils/sanitize';
import styles from './ChatInterface.module.scss';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<IChatMessage[]>([
    {
      id: 1,
      text: 'Olá! Como posso ajudar você hoje? 😊',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (): Promise<void> => {
    if (!input.trim() || loading) {
      return;
    }

    const sanitizedInput = sanitizeInput(input);

    const userMessage: IChatMessage = {
      id: Date.now(),
      text: sanitizedInput,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const answer = await chatService.askQuestion({
        question: sanitizedInput,
        userId: user.id,
        userName: user.name,
      });

      const sanitizedAnswer = sanitizeResponse(answer);

      const assistantMessage: IChatMessage = {
        id: Date.now() + 1,
        text: sanitizedAnswer,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Erro:', err);
      setError(err instanceof Error ? err.message : 'Erro ao processar pergunta');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions: string[] = [
    'Quais são os horários de atendimento?',
    'Onde estão localizados os escritórios?',
    'Quem fundou a FinTechX?',
    'Como vocês protegem meus dados?',
    'Recebi e-mail suspeito, o que fazer?',
    'Como aprender sobre investimentos?',
    'Como receber promoções?',
  ];

  const handleRetry = () => {
    if (error) {
      setError(null);
      sendMessage();
    }
  };

  return (
    <div className={styles['chat-interface']}>
      <div className={styles.header}>
        <h1 className={styles.title}>BrainBox</h1>
      </div>

      <div className={styles.messages}>
        {messages.map((msg) => (
          <Message
            key={msg.id}
            message={msg.text}
            isUser={msg.isUser}
            userName={user.name}
            timestamp={msg.timestamp}
          />
        ))}
        {loading && (
          <div className={styles['typing-indicator']}>
            <div className={styles.content}>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.text}>IA está pensando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles['input-area']}>
        {!error && suggestedQuestions.length > 0 && (
          <div className={styles['suggestion-list']}>
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  const sanitizedQuestion = sanitizeInput(question);
                  setInput(sanitizedQuestion);
                }}
                className={styles.chip}
              >
                {question}
              </button>
            ))}
          </div>
        )}

        {error && (
          <button className={styles['retry-btn']} onClick={handleRetry}>
            <Icon name="retry" size={16} color="#616161" />
            <span>Gerar Resposta Novamente</span>
          </button>
        )}

        <div className={styles['input-wrapper']}>
          <textarea
            className={styles.field}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enviar uma mensagem."
            rows={1}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className={styles['send-btn']}
            data-testid="send-button"
          >
            <Icon name="send" size={20} color="#A3A3A8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
