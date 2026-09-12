// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useState } from "react";
// import { 
//   FileCheck, 
//   PlusCircle, 
//   Sparkles, 
//   FileText, 
//   Snowflake, 
//   MinusCircle, 
//   RefreshCw, 
//   ArrowLeft, 
//   ChevronRight, 
//   Construction 
// } from "lucide-react";
// import StudentWithdrawalForm from "./StudentWithdrawalForm";
// import studentcourseregistrationform from "./studentcourseregistrationform";
// interface SubmitRequestProps {
//   onBack: () => void;
//   student?: any;
// }

// export default function SubmitRequest({ onBack, student }: SubmitRequestProps) {
//   const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

//   const requestCards = [
//     { 
//       id: "course-registration", 
//       title: "Course Registration Form", 
//       icon: FileCheck, 
//       desc: "Register for your core and elective courses for the upcoming semester.", 
//       color: "bg-blue-50 text-blue-600 border-blue-100" 
//     },
//     { 
//       id: "extra-credits", 
//       title: "Extra Credits Allowance Form", 
//       icon: PlusCircle, 
//       desc: "Apply for additional credit hours limit beyond the standard workload.", 
//       color: "bg-amber-50 text-amber-600 border-amber-100" 
//     },
//     { 
//       id: "special-offering", 
//       title: "Special Course Offering Form", 
//       icon: Sparkles, 
//       desc: "Request the department to offer an unscheduled course for this term.", 
//       color: "bg-emerald-50 text-emerald-600 border-emerald-100" 
//     },
//     { 
//       id: "student-application", 
//       title: "Student Application Form", 
//       icon: FileText, 
//       desc: "General academic applications, inquiries, and administrative requests.", 
//       color: "bg-indigo-50 text-indigo-600 border-indigo-100" 
//     },
//     { 
//       id: "semester-freezing", 
//       title: "Semester Freezing Form", 
//       icon: Snowflake, 
//       desc: "Apply for a formal semester freeze or leave of absence.", 
//       color: "bg-purple-50 text-purple-600 border-purple-100" 
//     },
//     { 
//       id: "course-withdrawal", 
//       title: "Course Withdrawal Form", 
//       icon: MinusCircle, 
//       desc: "Formally drop a course after the initial registration period.", 
//       color: "bg-rose-50 text-rose-600 border-rose-100" 
//     },
//     { 
//       id: "course-replacement", 
//       title: "Course Replacement Form", 
//       icon: RefreshCw, 
//       desc: "Substitute a previously failed or discontinued course with an approved alternative.", 
//       color: "bg-teal-50 text-teal-600 border-teal-100" 
//     }
//   ];

//   if (selectedRequest) {
//     // Agar Course Withdrawal select ho to Form open karein
//     if (selectedRequest === "course-withdrawal") {
//       return (
//         <StudentWithdrawalForm
//           student={student}
//           onBack={() => setSelectedRequest(null)}
//         />
//       );
//       else if (selectedRequest === "studentcourseregistrationform") {
//         return (
//           <StudentCourseRegistrationForm
//             student={student}
//             onBack={() => setSelectedRequest(null)}
//           />
//         );
//       }
//     }

//     // Baaqi sab forms ke liye Coming Soon
//     const currentCard = requestCards.find((card) => card.id === selectedRequest);

//     return (
//       <div className="w-full animate-in slide-in-from-right duration-500 max-w-full mx-auto px-4 text-center">
//         <div className="flex justify-start mb-8">
//           <button 
//             onClick={() => setSelectedRequest(null)} 
//             className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors outline-none"
//           >
//             <ArrowLeft size={20} />
//           </button>
//         </div>
        
//         <div className="bg-white rounded-[2rem] border border-slate-100 p-10 md:p-16 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center">
//           <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
//             <Construction size={32} />
//           </div>
//           <h2 className="text-2xl md:text-3xl font-black text-[#1e3a5f] uppercase tracking-tighter mb-3">
//             Coming Soon
//           </h2>
//           <p className="text-slate-500 font-bold text-xs md:text-sm max-w-sm">
//             The <span className="text-[#1e3a5f]">{currentCard?.title}</span> feature is currently under development.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full animate-in fade-in duration-700 space-y-6 px-4">
//       {/* Header Section */}
//       <div className="flex items-center gap-5">
//         {onBack && (
//           <button 
//             onClick={onBack} 
//             className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors outline-none"
//           >
//             <ArrowLeft size={20} />
//           </button>
//         )}
//         <div>
//           <h2 className="text-xl md:text-2xl font-black text-[#1e3a5f] uppercase tracking-tighter">Submit Request</h2>
//           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Academic Administration</p>
//         </div>
//       </div>

//       {/* Full Width Grid */}
//       <div className="grid grid-cols-1 gap-4 w-full pb-10">
//         {requestCards.map((card) => {
//           const IconComponent = card.icon;
          
//           return (
//             <div 
//               key={card.id} 
//               onClick={() => setSelectedRequest(card.id)} 
//               className="group bg-white border border-slate-100 rounded-[1.2rem] md:rounded-[1.5rem] p-4 md:p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex items-center gap-4 md:gap-6 w-full"
//             >
//               {/* Icon Box */}
//               <div className={`shrink-0 w-12 h-12 md:w-14 md:h-14 ${card.color} rounded-xl flex items-center justify-center transition-transform duration-300 shadow-sm`}>
//                 <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
//               </div>

//               {/* Text Content */}
//               <div className="flex-1 min-w-0">
//                 <h3 className="text-sm md:text-base font-black text-[#1e3a5f] uppercase tracking-tight mb-1">
//                   {card.title}
//                 </h3>
//                 <p className="text-slate-500 text-[10px] md:text-xs font-bold leading-tight">
//                   {card.desc}
//                 </p>
//               </div>

//               {/* Action Icon */}
//               <div className="h-8 w-8 md:h-10 md:w-10 shrink-0 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-amber-500 group-hover:text-white transition-all">
//                 <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
































/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { 
  FileCheck, 
  PlusCircle, 
  Sparkles, 
  FileText, 
  Snowflake, 
  MinusCircle, 
  RefreshCw, 
  ArrowLeft, 
  ChevronRight, 
  Construction 
} from "lucide-react";
import StudentWithdrawalForm from "./StudentWithdrawalForm";
import StudentCourseRegistrationForm from "./StudentCourseRegistrationForm";
import StudentSemesterFreezingForm from "./StudentSemesterFreezingForm";
import StudentApplicationForm from "./StudentApplicationForm";

interface SubmitRequestProps {
  onBack: () => void;
  student?: any;
}

export default function SubmitRequest({ onBack, student }: SubmitRequestProps) {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const requestCards = [
    { 
      id: "course-registration", 
      title: "Course Registration Form", 
      icon: FileCheck, 
      desc: "Register for your core and elective courses for the upcoming semester.", 
      color: "bg-blue-50 text-blue-600 border-blue-100" 
    },
    { 
      id: "extra-credits", 
      title: "Extra Credits Allowance Form", 
      icon: PlusCircle, 
      desc: "Apply for additional credit hours limit beyond the standard workload.", 
      color: "bg-amber-50 text-amber-600 border-amber-100" 
    },
    { 
      id: "special-offering", 
      title: "Special Course Offering Form", 
      icon: Sparkles, 
      desc: "Request the department to offer an unscheduled course for this term.", 
      color: "bg-emerald-50 text-emerald-600 border-emerald-100" 
    },
    { 
      id: "student-application", 
      title: "Student Application Form", 
      icon: FileText, 
      desc: "General academic applications, inquiries, and administrative requests.", 
      color: "bg-indigo-50 text-indigo-600 border-indigo-100" 
    },
    { 
      id: "semester-freezing", 
      title: "Semester Freezing Form", 
      icon: Snowflake, 
      desc: "Apply for a formal semester freeze or leave of absence.", 
      color: "bg-purple-50 text-purple-600 border-purple-100" 
    },
    { 
      id: "course-withdrawal", 
      title: "Course Withdrawal Form", 
      icon: MinusCircle, 
      desc: "Formally drop a course after the initial registration period.", 
      color: "bg-rose-50 text-rose-600 border-rose-100" 
    },
    { 
      id: "course-replacement", 
      title: "Course Replacement Form", 
      icon: RefreshCw, 
      desc: "Substitute a previously failed or discontinued course with an approved alternative.", 
      color: "bg-teal-50 text-teal-600 border-teal-100" 
    }
  ];

  if (selectedRequest) {
    if (selectedRequest === "course-withdrawal") {
      return (
        <StudentWithdrawalForm
          student={student}
          onBack={() => setSelectedRequest(null)}
        />
      );
    } else if (selectedRequest === "course-registration") {
      return (
        <StudentCourseRegistrationForm
          student={student}
          onBack={() => setSelectedRequest(null)}
        />
      );
    } else if (selectedRequest === "semester-freezing") {
      return (
        <StudentSemesterFreezingForm
          student={student}
          onBack={() => setSelectedRequest(null)}
        />
      );
    } else if (selectedRequest === "student-application") {
      return (
        <StudentApplicationForm
          student={student}
          onBack={() => setSelectedRequest(null)}
        />
      );
    }

    const currentCard = requestCards.find((card) => card.id === selectedRequest);

    return (
      <div className="w-full animate-in slide-in-from-right duration-500 max-w-full mx-auto px-4 text-center">
        <div className="flex justify-start mb-8">
          <button 
            onClick={() => setSelectedRequest(null)} 
            className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors outline-none"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
        
        <div className="bg-white rounded-[2rem] border border-slate-100 p-10 md:p-16 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
            <Construction size={32} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-[#1e3a5f] uppercase tracking-tighter mb-3">
            Coming Soon
          </h2>
          <p className="text-slate-500 font-bold text-xs md:text-sm max-w-sm">
            The <span className="text-[#1e3a5f]">{currentCard?.title}</span> feature is currently under development.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in duration-700 space-y-6 px-4">
      {/* Header Section */}
      <div className="flex items-center gap-5">
        {onBack && (
          <button 
            onClick={onBack} 
            className="p-2 hover:bg-slate-200 bg-white shadow-sm rounded-full text-black transition-colors outline-none"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#1e3a5f] uppercase tracking-tighter">Submit Request</h2>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Academic Administration</p>
        </div>
      </div>

      {/* Full Width Grid */}
      <div className="grid grid-cols-1 gap-4 w-full pb-10">
        {requestCards.map((card) => {
          const IconComponent = card.icon;
          
          return (
            <div 
              key={card.id} 
              onClick={() => setSelectedRequest(card.id)} 
              className="group bg-white border border-slate-100 rounded-[1.2rem] md:rounded-[1.5rem] p-4 md:p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition-all cursor-pointer flex items-center gap-4 md:gap-6 w-full"
            >
              {/* Icon Box */}
              <div className={`shrink-0 w-12 h-12 md:w-14 md:h-14 ${card.color} rounded-xl flex items-center justify-center transition-transform duration-300 shadow-sm`}>
                <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-base font-black text-[#1e3a5f] uppercase tracking-tight mb-1">
                  {card.title}
                </h3>
                <p className="text-slate-500 text-[10px] md:text-xs font-bold leading-tight">
                  {card.desc}
                </p>
              </div>

              {/* Action Icon */}
              <div className="h-8 w-8 md:h-10 md:w-10 shrink-0 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-amber-500 group-hover:text-white transition-all">
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}