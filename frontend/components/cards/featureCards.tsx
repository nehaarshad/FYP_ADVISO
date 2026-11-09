
// export default SmallFeature;


import React from "react";
import type { LucideIcon } from "lucide-react";

interface FeatureProps {
  Icon: LucideIcon;
  title: string;
  desc: string;
}

const SmallFeature: React.FC<FeatureProps> = ({ Icon, title, desc }) => (
  <div className="p-8 border-2 border-blue-100 rounded-[2rem] hover:shadow-2xl hover:border-[#1B4B82] transition-all bg-white flex flex-col items-center text-center group h-full">
    {/* Icon wrapper */}
    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 text-[#F2A93B] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#1B4B82] group-hover:text-[#F2A93B] transition-all border border-blue-50 shadow-sm">
      <Icon size={32} />
    </div>

    {/* Title */}
    <h4 className="text-base md:text-lg font-semibold text-[#1B4B82] mb-3 leading-tight">
      {title}
    </h4>

    {/* Description */}
    <p className="text-sm md:text-base font-normal text-[#526782] leading-relaxed">
      {desc}
    </p>
  </div>
);

export default SmallFeature;