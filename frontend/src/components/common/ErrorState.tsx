import React from "react";

interface ErrorStateProps {
  title?: string;
  message: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message,
}) => {
  return (
    <div className="flex h-full items-center justify-center p-8 text-center text-red-500">
      <div className="max-w-md">
        <h3 className="mb-2 text-lg font-bold">{title}</h3>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default ErrorState;
