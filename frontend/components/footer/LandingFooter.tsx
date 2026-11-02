import React from 'react';

const LandingFooter = () => {
  // Next.js mein smooth scroll ke liye yeh function banaya gaya hai
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#1e3a5f] text-white py-12 px-6 border-t-4 border-[#FDB813]"> 
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center">
        
        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-8 font-semibold text-sm">
          <a 
            href="#home" 
            onClick={(e) => handleScroll(e, 'home')} 
            className="hover:text-[#FDB813] transition-colors cursor-pointer"
          >
            Home
          </a>
          <a 
            href="#services" 
            onClick={(e) => handleScroll(e, 'services')} 
            className="hover:text-[#FDB813] transition-colors cursor-pointer"
          >
            Services
          </a>
          <a 
            href="#about" 
            onClick={(e) => handleScroll(e, 'about')} 
            className="hover:text-[#FDB813] transition-colors cursor-pointer"
          >
            About Us
          </a>
          <a 
            href="#features" 
            onClick={(e) => handleScroll(e, 'features')} 
            className="hover:text-[#FDB813] transition-colors cursor-pointer"
          >
            Features
          </a>
        </div>

        {/* Existing Content */}
        <h3 className="text-xl font-bold mb-2">FYP Adviso</h3>
        <p className="mb-4 text-white/70">Empowering academic advising with technology.</p>
        <p className="text-xs text-white/50">&copy; 2024 FYP Adviso. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default LandingFooter;