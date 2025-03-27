import React from "react";

// Button Component
export const Button = ({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Input Component
export const Input = ({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) => {
  return (
    <input
      className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 ${className}`}
      {...props}
    />
  );
};