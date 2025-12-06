import React from 'react';
import './Input.css';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'date' | 'datetime-local';
  error?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  required?: boolean;
  onKeyPress?: (e: React.KeyboardEvent) => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  disabled = false,
  icon,
  fullWidth = false,
  required = false,
  onKeyPress,
}) => {
  return (
    <div className={`input-wrapper ${fullWidth ? 'input-full-width' : ''}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          className={`input ${error ? 'input-error' : ''} ${icon ? 'input-with-icon' : ''}`}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          disabled={disabled}
          required={required}
        />
      </div>
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
};

