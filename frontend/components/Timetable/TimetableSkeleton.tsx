// import React from 'react';

// export const TimetableSkeleton: React.FC = () => (
//   <div className="space-y-3 animate-pulse">
//     {[1, 2, 3, 4].map((i) => (
//       <div key={i} className="flex items-center gap-4 p-4 bg-white border rounded-lg">
//         <div className="w-12 h-12 bg-gray-200 rounded-lg" />
//         <div className="flex-1 space-y-2">
//           <div className="h-4 bg-gray-200 rounded w-1/3" />
//           <div className="h-3 bg-gray-100 rounded w-1/2" />
//         </div>
//       </div>
//     ))}
//   </div>
// );


import React from 'react';

export const TimetableSkeleton: React.FC = () => (
  <div className="space-y-3 animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-xs">
        <div className="w-14 h-14 bg-slate-200 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="h-4 bg-slate-200 rounded-lg w-1/3" />
          <div className="h-3 bg-slate-100 rounded-lg w-1/2" />
        </div>
      </div>
    ))}
  </div>
);