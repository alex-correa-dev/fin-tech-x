import React from 'react';
import styles from './Icon.module.scss';
import { iconComponents, IconName } from './icons';

export type { IconName };

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color = 'currentColor',
  className,
  onClick,
}) => {
  const IconComponent = iconComponents[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <span
      data-testid="icon-container"
      className={`${styles.icon} ${className || ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <IconComponent width={size} height={size} stroke={color} fill="none" />
    </span>
  );
};

export default Icon;
