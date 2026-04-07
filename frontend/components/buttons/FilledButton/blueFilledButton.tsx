import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface BlueFilledButtonProps {
  text: string;
  type?: "submit" | "button" | "reset" | undefined;
  onClick?: () => void;
}

const BlueFilledButton: React.FC<BlueFilledButtonProps> = ({ text, onClick, type = "submit" }) => {
  return ( 
    <motion.button 
      type={type} 
      whileHover={{ scale: 1.02, backgroundColor: "#162d4a" }} 
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full bg-[#1e3a5f] text-white py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/20 transition-all mt-8"
    >
      {text} <ArrowRight size={22} strokeWidth={3} />
    </motion.button>
  ); 
};

export default BlueFilledButton;