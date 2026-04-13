import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../../services/chat';
import Message from '../Message/Message';
import { IChatMessage } from '../../types';
import styles from './ChatInterface.module.scss';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<IChatMessage[]>([
    {
      id: 1,
      text: 'Olá! Sou o assistente inteligente da FinTechX, alimentado por Google Gemini AI. Como posso ajudar você hoje? 😊',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (): Promise<void> => {
    if (!input.trim() || loading) return;

    const userMessage: IChatMessage = {
      id: Date.now(),
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const answer = await chatService.askQuestion({
        question: input,
        userId: user.id,
        userName: user.name
      });

      const assistantMessage: IChatMessage = {
        id: Date.now() + 1,
        text: answer,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro:', error);

      const errorMessage: IChatMessage = {
        id: Date.now() + 1,
        text: error instanceof Error ? error.message : 'Desculpe, tive um problema. Tente novamente mais tarde. 😔',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
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
    "📅 Quais são os horários de atendimento?",
    "📍 Onde estão localizados os escritórios?",
    "👥 Quem fundou a FinTechX?",
    "🔒 Como vocês protegem meus dados?",
    "⚠️ Recebi e-mail suspeito, o que fazer?",
    "📚 Como aprender sobre investimentos?",
    "🎁 Como receber promoções e descontos?"
  ];

  return (
    <div className={`${styles['chat-interface']} ${loading ? styles['-loading'] : ''}`}>
      <div className={styles.header}>
        <div className={styles['header-content']}>
          <div className={styles.brand}>
            <span className={styles.icon}>🤖</span>
            <div className={styles.info}>
              <h2 className={styles.title}>Assistente Inteligente FinTechX</h2>
              <p className={styles.subtitle}>Powered by Google Gemini AI • Atendimento personalizado 24/7</p>
            </div>
          </div>
          <div className={styles['status-indicator']}>
            <span className={styles.dot}></span>
            <span>Online</span>
          </div>
        </div>
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
        <div className={styles['suggestion-list']}>
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => setInput(question)}
              className={styles.chip}
            >
              {question}
            </button>
          ))}
        </div>

        <div className={styles['input-wrapper']}>
          <textarea
            className={styles.field}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua pergunta..."
            rows={2}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className={styles['send-btn']}
          >
            {loading ? '...' : 'Enviar →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;