import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  onClick,
  icon,
}) => {
  return (
    <div className={`card ${onClick ? 'card-clickable' : ''} ${className}`} onClick={onClick}>
      {(title || subtitle || actions || icon) && (
        <div className="card-header">
          <div className="card-header-left">
            {icon && <span className="card-icon">{icon}</span>}
            <div>
              {title && <h3 className="card-title">{title}</h3>}
              {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className="card-content">{children}</div>
    </div>
  );
};

