import React from "react";

interface AlertMessageProps {
  message: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export function AlertMessage({ message, bgColor, borderColor, textColor }: AlertMessageProps) {
  return (
    <div
      className="p-2 rounded border"
      style={{ backgroundColor: bgColor, borderColor: borderColor, color: textColor }}
    >
      {message}
    </div>
  );
}