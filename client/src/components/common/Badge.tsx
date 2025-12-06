import React from 'react';
import './Badge.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'small' | 'medium';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'small',
  icon,
}) => {
  return (
    <span className={`badge badge-${variant} badge-${size}`}>
      {icon && <span className="badge-icon">{icon}</span>}
      {children}
    </span>
  );
};

