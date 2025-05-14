import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-error-100 border-l-4 border-error-500 text-error-700 p-4 rounded-md my-4 animate-fade-in">
      <div className="flex">
        <div className="flex-shrink-0">
          <FaExclamationTriangle className="h-5 w-5 text-error-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm">{message || 'An unexpected error occurred. Please try again later.'}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;