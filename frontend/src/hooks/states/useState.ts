// hooks/useSuccessMessage.ts
import { useState, useEffect } from "react";

export const useSuccessMessage = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return { successMessage, setSuccessMessage };
};