import React from "react";
import type { LucideIcon } from "lucide-react";

interface FeatureProps {
  Icon: LucideIcon;
  title: string;
  desc: string;
}

const SmallFeature: React.FC<FeatureProps> = ({ Icon, title, desc }) => (
  <div className="p-8 border-2 border-blue-100 rounded-[2rem] hover:shadow-2xl hover:border-[#1e3a5f] transition-all bg-white flex flex-col items-center text-center group h-full">
    {/* Icon wrapper */}
    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 text-[#FDB813] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#1e3a5f] group-hover:text-[#FDB813] transition-all border border-blue-50 shadow-sm">
      <Icon size={32} /> {/* increased size */}
    </div>

    {/* Title */}
    <h4 className="text-base md:text-lg font-black uppercase tracking-wide text-[#1e3a5f] mb-3 leading-tight">
      {title}
    </h4>

    {/* Description */}
    <p className="text-sm md:text-base font-medium text-slate-500 leading-relaxed">
      {desc}
    </p>
  </div>
);

export default SmallFeature;
