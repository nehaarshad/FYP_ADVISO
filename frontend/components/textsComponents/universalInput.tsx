
// export default UniversalInput;

import React from "react";
import type { LucideIcon } from "lucide-react";

interface InputParams {
  Icon: LucideIcon;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  disabled?: boolean;
  onChange: (val: string) => void;
}

const UniversalInput: React.FC<InputParams> = ({
  Icon,
  label,
  type = "text",
  placeholder,
  value,
  disabled,
  onChange,
}) => {
  return (
    <div className="space-y-2 text-left">
      <label className="ml-1 text-medium font-medium text-[#152336]">
        {label}
      </label>

      <div className="relative group">
        {Icon && (
          <Icon
            className="absolute left-5 top-1/2 -translate-y-1/2 text-[#91A1B7] group-focus-within:text-[#1B4B82] transition-colors"
            size={20}
          />
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-900/5 focus:border-[#1B4B82] transition-all font-medium text-[#1B3555] placeholder:text-[#91A1B7] placeholder:font-normal disabled:opacity-60"
        />
      </div>
    </div>
  );
};

export default UniversalInput;