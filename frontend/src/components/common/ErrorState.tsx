import React from 'react';

interface ErrorStateProps {
  title?: string;
  message: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = "Something went wrong", 
  message 
}) => {
  return (
    <div className="h-full flex items-center justify-center text-red-500 p-8 text-center">
      <div className="max-w-md">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default ErrorState;
