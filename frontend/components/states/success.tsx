// components/SuccessMessage.tsx
import React from "react";
import { Check } from "lucide-react";

interface SuccessMessageProps {
  message: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  return (
    <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-700 text-sm">
      <Check size={18} />
      {message}
    </div>
  );
};