import React, { useState } from 'react';
import Icon, { IconName } from '../Icon/Icon';
import styles from './Input.module.scss';

interface InputProps {
  type: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  iconLeft?: IconName;
  iconRight?: IconName;
  onIconRightClick?: () => void;
}

const Input: React.FC<InputProps> = ({
  type,
  id,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  iconLeft,
  iconRight,
  onIconRightClick,
}) => {
  const [inputType, setInputType] = useState(type);

  const handleRightIconClick = () => {
    if (type === 'password') {
      setInputType(inputType === 'password' ? 'text' : 'password');
    }

    onIconRightClick?.();
  };

  return (
    <div className={styles.inputWrapper}>
      {iconLeft && (
        <span className={styles.iconLeft}>
          <Icon name={iconLeft} size={20} color="#CBCBCB" />
        </span>
      )}
      <input
        type={inputType}
        id={id}
        name={name}
        className={styles.input}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
      />
      {iconRight && (
        <span className={styles.iconRight} onClick={handleRightIconClick}>
          <Icon name={iconRight} size={20} color="#CBCBCB" />
        </span>
      )}
    </div>
  );
};

export default Input;
