import React from 'react';
import { Sparkles } from 'lucide-react';
 
interface GeneratingScreenProps {
  studentName: string;
  sessionType: string;
  sessionYear: number;
}
 
const STEPS = [
  'Fetching student transcript...',
  'Mapping roadmap courses...',
  'Checking prerequisites...',
  'Analyzing F / W / D grades...',
  'Consulting AI advisor...',
  'Building recommendations...',
];
 
export const GeneratingRecommendationsScreen: React.FC<GeneratingScreenProps> = ({
  studentName,
  sessionType,
  sessionYear,
}) => {
  const [stepIndex, setStepIndex] = React.useState(0);
 
  React.useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex(i => (i < STEPS.length - 1 ? i + 1 : i));
    }, 2000);
    return () => clearInterval(interval);
  }, []);
 
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 animate-in fade-in duration-500">
      {/* Pulsing icon */}
      <div className="relative mb-8">
        <div className="w-20 h-20 bg-[#1e3a5f] rounded-3xl flex items-center justify-center shadow-2xl shadow-[#1e3a5f]/30">
          <Sparkles size={36} className="text-amber-400 animate-pulse" />
        </div>
        <div className="absolute inset-0 bg-[#1e3a5f]/20 rounded-3xl animate-ping" />
      </div>
 
      <h2 className="text-xl font-black text-[#1e3a5f] uppercase tracking-tighter text-center mb-1">
        Generating Recommendations
      </h2>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-8">
        {studentName} · {sessionType} {sessionYear}
      </p>
 
      {/* Step list */}
      <div className="w-full max-w-xs space-y-3">
        {STEPS.map((step, i) => (
          <div
            key={step}
            className={`flex items-center gap-3 transition-all duration-500 ${
              i < stepIndex
                ? 'opacity-40'
                : i === stepIndex
                ? 'opacity-100'
                : 'opacity-20'
            }`}
          >
            <div className={`w-2 h-2 rounded-full shrink-0 transition-all ${
              i < stepIndex
                ? 'bg-green-400'
                : i === stepIndex
                ? 'bg-amber-400 animate-pulse'
                : 'bg-slate-200'
            }`} />
            <p className="text-[11px] font-bold text-slate-600">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
};