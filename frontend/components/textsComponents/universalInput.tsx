import React from "react";
import type { LucideIcon } from "lucide-react";

interface InputParams {
  Icon: LucideIcon;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  disabled?: boolean;
  onChange: (val: string) => void; // fix typing
}

const UniversalInput: React.FC<InputParams> = ({ Icon, label, type="text", placeholder, value, disabled, onChange }) => {
  return ( // ✅ added return
    <div className="space-y-2 text-left">
      <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.15em] ml-1">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <Icon
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1e3a5f] transition-colors"
            size={20}
          />
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-900/5 focus:border-[#1e3a5f] transition-all font-bold text-[#1e3a5f] placeholder:text-slate-300"
        />
      </div>
    </div>
  );
};

export default UniversalInput;
