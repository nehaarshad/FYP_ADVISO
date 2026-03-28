import React from "react";

interface OutlinedTextHeadingProps {
  text: string;
  hasDot?: boolean;
}

const OutlinedTextHeading: React.FC<OutlinedTextHeadingProps> = ({ text, hasDot = true }) => {
  return (
    <div className="flex justify-center mb-20 ">
      <button className="px-8 py-2 border-2 border-slate-200 rounded-full text-[#1e3a5f] font-bold text-sm md:text-lg flex items-center gap-4">
        {hasDot && <span className="text-[#1e3a5f] text-3xl">•</span>}
        <span>{text}</span>
      </button>
    </div>
  );
};

export default OutlinedTextHeading;
