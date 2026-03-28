import Image from "next/image";

const LandingFooter = () => {
  return (
    <footer className="bg-[#123E63] text-white border-t-[6px] border-[#FDB813]">
      <div className="max-w-7xl mx-auto md:px-10 py-7">
        
        {/* Flex container for left and right columns */}
        <div className="flex flex-col md:flex-row items-start">
          
          <div className="md:w-1/8 mt-10">
              <Image 
              src="/lightLogo.png" 
              alt="Adviso" 
              width={120}
              height={120}
              //className="h-12 w-auto"
            />
          </div>

          <div className="md:w-2/3 text-left">
            
            {/* Row 1 - Social Media Icons */}
            <div className="flex gap-3 mb-6">
              <Image 
              src="/Facebook.png" 
              alt="Adviso" 
              width={5}
              height={5}
              className="h-8 w-auto"
            />
              <Image 
              src="/Instagram.png" 
              alt="Adviso" 
              width={5}
              height={5}
              className="h-8 w-auto"
            /><Image 
              src="/LinkedIn.png" 
              alt="Adviso" 
              width={5}
              height={5}
              className="h-8 w-auto"
            />
            </div>

            <p className="text-sm  opacity-80 leading-relaxed mb-1">
              Riphah International University Gulberg Green Campus Islamabad
            </p>

            {/* Row 3 - Navigation Links with Pipe Separator */}
            <div className="text-sm">
              <span className="cursor-pointer opacity-80 hover:text-[#FDB813] transition-colors">Home</span>
              <span className="mx-2 opacity-80">|</span>
              <span className="cursor-pointer opacity-80 hover:text-[#FDB813] transition-colors">Services</span>
              <span className="mx-2 opacity-80">|</span>
              <span className="cursor-pointer opacity-80 hover:text-[#FDB813] transition-colors">About Us</span>
              <span className="mx-2 opacity-80">|</span>
              <span className="cursor-pointer opacity-80 hover:text-[#FDB813] transition-colors">Features</span>
            </div>
          </div>
        </div>

        {/* Dotted Divider */}
        <div className="border-t border-dotted border-white/30 mt-5 pt-4 text-xs opacity-80 px-20">
          © 2026 Adviso. Academic Batch Advisor System.
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;