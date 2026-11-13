
// export default OutlinedTextHeading;
import React from "react";

interface OutlinedTextHeadingProps {
  text: string;
  hasDot?: boolean;
}

const OutlinedTextHeading: React.FC<OutlinedTextHeadingProps> = ({
  text,
  hasDot = true,
}) => {
  return (
    <div className="flex justify-center mb-20">
      <button className="px-18 py-2 border-2 border-gray-300 rounded-full text-[#1B4B82] font-bold text-medium md:text-lg flex items-center gap-4">
        {hasDot && (
          <span className="text-[#1B4B82] text-2xl">•</span>
        )}
        <span>{text}</span>
      </button>
    </div>
  );
};

export default OutlinedTextHeading;