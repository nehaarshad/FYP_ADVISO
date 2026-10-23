'use client';

import { useSessionTimeout } from "@/src/hooks/sessionalTimeoutHook/useSessionalTimeout";

export default function SessionWrapper({ children }: { children: React.ReactNode }) {
  useSessionTimeout(3); 

  return <>{children}</>;
}