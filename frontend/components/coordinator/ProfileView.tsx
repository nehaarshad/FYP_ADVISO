export function ProfileView() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100">
      <div className="flex items-center gap-8 mb-10">
        <div className="h-24 w-24 bg-[#FDB813] rounded-[2rem] flex items-center justify-center text-3xl font-black text-[#1e3a5f]">AA</div>
        <div>
          <h2 className="text-3xl font-black text-[#1e3a5f] uppercase italic">Aleena Ayub</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest">Program Coordinator</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 bg-slate-50 rounded-2xl">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Email</p>
          <p className="font-bold text-[#1e3a5f]">aleena.ayub@riphah.edu.pk</p>
        </div>
        <div className="p-6 bg-slate-50 rounded-2xl">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Department</p>
          <p className="font-bold text-[#1e3a5f]">Software Engineering</p>
        </div>
      </div>
    </div>
  );
}