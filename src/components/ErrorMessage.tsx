import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="error-container" role="alert">
      <AlertCircle size={40} className="error-icon" />
      <h3 className="error-title">Unable to Load Movies</h3>
      <p className="error-text">{message}</p>
      {onRetry && (
        <button type="button" className="retry-button" onClick={onRetry}>
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
