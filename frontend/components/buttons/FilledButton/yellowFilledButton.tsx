

import React from "react";

interface YellowFilledButtonProps {
  text: string;
  onClick?: () => void;
}

const FilledButton: React.FC<YellowFilledButtonProps> = ({
  text,
  onClick,
}) => {
  return (
    <div className="flex justify-center mb-20">
      <button
        onClick={onClick}
        className="px-18 py-3 bg-[#F2A93B] text-[#1B4B82] font-semibold text-sm md:text-lg rounded-full flex items-center gap-4 hover:bg-[#e6a800] transition-all"
      >
        {text}
      </button>
    </div>
  );
};

export default FilledButton;