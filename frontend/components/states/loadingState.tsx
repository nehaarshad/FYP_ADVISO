import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Loader2 size={40} className="animate-spin text-[#FDB813] mx-auto mb-4" />
        <p className="text-slate-500 font-bold">{message}</p>
      </div>
    </div>
  );
}