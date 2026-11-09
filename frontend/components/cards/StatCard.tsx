
// import React from 'react';
// import { LucideIcon } from 'lucide-react';

// interface StatCardProps {
//   label: string;

// export default StatCard;


import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  variant?: 'Recent' | 'Previous' | 'Total' | 'AdvisoryLog';
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  isActive,
  onClick,
  variant,
}) => {

  const getStyles = () => {
    if (isActive) {
      return "border-amber-400 border-2 bg-amber-50/30 scale-105 shadow-xl ring-4 ring-amber-400/10";
    }

    if (variant === 'AdvisoryLog') {
      return "border-slate-100 bg-white hover:border-[#1B4B82] hover:shadow-lg hover:-translate-y-1";
    }

    return "border-slate-100 bg-white hover:border-amber-400 hover:shadow-lg hover:-translate-y-1";
  };

  return (
    <button
      onClick={onClick}
      className={`h-[160px] w-full rounded-[32px] transition-all duration-500 flex flex-col items-start justify-between p-7 border group ${getStyles()}`}
    >
      {/* Icon Container */}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
        isActive
          ? 'bg-amber-400 text-[#1B4B82]'
          : variant === 'AdvisoryLog'
            ? 'bg-blue-50 text-[#1B4B82] group-hover:bg-[#1B4B82] group-hover:text-white'
            : 'bg-slate-50 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600'
      }`}>
        <Icon size={24} />
      </div>

      {/* Text Content */}
      <div className="text-left w-full">
        <p className={`text-xs font-medium tracking-[0.2em] mb-1 transition-colors ${
          isActive
            ? 'text-[#526782]'
            : variant === 'AdvisoryLog'
              ? 'text-[#526782] group-hover:text-[#1B4B82]'
              : 'text-[#526782] group-hover:text-[#1B4B82]'
        }`}>
          {label}
        </p>

        <p className="text-2xl font-bold leading-tight text-[#1B4B82]">
          {value}
        </p>
      </div>
    </button>
  );
};

export default StatCard;