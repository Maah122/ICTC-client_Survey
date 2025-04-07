import React from "react";

export const Card = ({ children, className }) => {
  return (
    <div
      className={`bg-white p-4 rounded-lg shadow-md border border-gray-200 ${className}`}
    >
      {children}
    </div>
  );
};

// You can also create a `CardContent` if you'd like to separate the content inside a card, for example:
export const CardContent = ({ children }) => {
  return <div className="mt-2">{children}</div>;
};