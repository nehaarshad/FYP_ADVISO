/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  Building2,
  Calendar,
  User,
  GraduationCap,
  ChevronDown,
  Award,
  XCircle,
  Hash,
  FileText,
  Mail,
  Phone
} from "lucide-react";

interface StudentSemesterFreezingFormProps {
  student?: any;
  requestData?: any;
  onBack: () => void;
}

export default function StudentSemesterFreezingForm({
  student,
  requestData,
  onBack
}: StudentSemesterFreezingFormProps) {
  const todayDate = new Date().toISOString().split("T")[0];

  const [requestDate, setRequestDate] = useState(requestData?.date || todayDate);
  const [studentName, setStudentName] = useState(student?.studentName || "");
  const [sapId, setSapId] = useState(student?.User?.sapid || "");
  const [cmsNo, setCmsNo] = useState(student?.cmsNo || "");
  const [semester, setSemester] = useState(student?.currentSemester?.toString() || "");
  const [program, setProgram] = useState(student?.BatchModel?.batchName || "");
  const [sgpaCgpa, setSgpaCgpa] = useState(requestData?.sgpaCgpa || "");
  const [instituteName, setInstituteName] = useState(requestData?.instituteName || "Riphah International University");
  const [campus, setCampus] = useState(requestData?.campus || "Gulberg Green Campus Islamabad");
  const [requestReason, setRequestReason] = useState(requestData?.requestReason || "");
  const [emailId, setEmailId] = useState(student?.User?.email || "");
  const [contactNo, setContactNo] = useState(student?.contactNo || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const status = requestData?.status || "Pending";
  const rejectionReason = requestData?.rejectionReason || "";
  const applicationNo = requestData?.applicationNo || "04291";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-12 animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 shadow-2xl text-center flex flex-col items-center relative overflow-hidden">
          <div className="w-20 h-20 bg-emerald-100/80 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <CheckCircle2 size={42} />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1e3a5f] tracking-tight mb-3">
            Semester Freezing Request Submitted
          </h2>
          <p className="text-slate-500 text-sm max-w-md mb-8 leading-relaxed">
            Your Semester Freezing Request has been successfully submitted and routed to the Program Coordination Office and HOD for approval.
          </p>
          <button
            onClick={onBack}
            className="bg-[#1e3a5f] text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#0f243f] text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">Semester Freezing Request</h1>
                <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                  status === "Approved" ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30" :
                  status === "Disapproved" ? "bg-rose-400/20 text-rose-300 border border-rose-400/30" :
                  "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                }`}>
                  Status: {status}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">Riphah International University Islamabad, Pakistan — Faculty of Computing</p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Ref Code: RIPHAH/FC/XX/CENT/F-02</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Applicant's Information */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><GraduationCap size={20} /></div>
              <div>
                <h3 className="text-base font-bold text-[#1e3a5f]">Applicant's Information</h3>
                <p className="text-xs text-slate-400">Please provide your personal and academic details for freezing</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 shrink-0">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5"><Calendar size={14} className="text-slate-500" /> Date:</label>
              <input
                type="date"
                required
                value={requestDate}
                onChange={(e) => setRequestDate(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                <User size={14} className="text-slate-400" /> Student Name (In Block Letters) as mentioned on Matric Certificate*
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="ENTER FULL NAME IN BLOCK LETTERS"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Hash size={14} className="text-slate-400" /> SAP ID*
              </label>
              <input
                type="text"
                required
                value={sapId}
                onChange={(e) => setSapId(e.target.value)}
                placeholder="Enter SAP ID"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Hash size={14} className="text-slate-400" /> CMS ID*
              </label>
              <input
                type="text"
                required
                value={cmsNo}
                onChange={(e) => setCmsNo(e.target.value)}
                placeholder="Enter CMS ID"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800"
              />
            </div>

            <div className="w-full relative z-20">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Current Semester*</label>
              <div className="relative">
                <select
                  required
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full appearance-none bg-slate-50/80 border border-slate-200 rounded-2xl pl-4 pr-10 py-3 text-xs font-medium text-slate-800 cursor-pointer"
                >
                  <option value="" disabled>Select Semester</option>
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                  <option value="3">3rd Semester</option>
                  <option value="4">4th Semester</option>
                  <option value="5">5th Semester</option>
                  <option value="6">6th Semester</option>
                  <option value="7">7th Semester</option>
                  <option value="8">8th Semester</option>
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="w-full relative z-10">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Building2 size={14} className="text-slate-400" /> Current Program*
              </label>
              <div className="relative">
                <select
                  required
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full appearance-none bg-slate-50/80 border border-slate-200 rounded-2xl pl-4 pr-10 py-3 text-xs font-medium text-slate-800 cursor-pointer"
                >
                  <option value="" disabled>Select Program</option>
                  <option value="BS Software Engineering">BS Software Engineering</option>
                  <option value="BS Computer Science">BS Computer Science</option>
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">SGPA / CGPA*</label>
              <input
                type="text"
                required
                value={sgpaCgpa}
                onChange={(e) => setSgpaCgpa(e.target.value)}
                placeholder="e.g. 3.42"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Institute Name*</label>
              <input
                type="text"
                required
                value={instituteName}
                onChange={(e) => setInstituteName(e.target.value)}
                placeholder="Riphah International University"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Campus*</label>
              <input
                type="text"
                required
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                placeholder="e.g. Gulberg Green Campus Islamabad"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Request Reason*</label>
              <textarea
                required
                rows={4}
                value={requestReason}
                onChange={(e) => setRequestReason(e.target.value)}
                placeholder="Please state detailed reason for freezing your semester..."
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-800 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Mail size={14} className="text-slate-400" /> Email ID*
              </label>
              <input
                type="email"
                required
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                placeholder="student@riphah.edu.pk"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Phone size={14} className="text-slate-400" /> Contact No*
              </label>
              <input
                type="text"
                required
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                placeholder="03XX-XXXXXXX"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Official Use Section */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><FileText size={20} /></div>
              <div>
                <h3 className="text-base font-bold text-[#1e3a5f]">Official Use</h3>
                <p className="text-xs text-slate-400">Application tracking and departmental remarks</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 shrink-0">
            <span className="text-xs font-bold text-slate-600">Application #:</span>
            <div className="flex gap-1">
              {applicationNo.split("").map((digit: string, i: number) => (
                <span key={i} className="w-6 h-6 bg-white border border-slate-200 rounded-md font-mono text-xs font-bold text-[#1e3a5f] flex items-center justify-center">
                  {digit}
                </span>
              ))}
            </div>
          </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Program Coordination Office Remarks</label>
              <input
                type="text"
                readOnly
                value={requestData?.coordinationRemarks || "Verified and forwarded to HOD for approval."}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-600 italic"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">HOD Approval / Remarks</label>
              <input
                type="text"
                readOnly
                value={requestData?.hodRemarks || (status === "Approved" ? "Approved for semester freezing." : status === "Disapproved" ? rejectionReason : "Pending review.")}
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-600 italic"
              />
            </div>
          </div>
        </div>

        {/* Signatures & Approvals Section */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-4">
            {/* Applicant Signature */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-full border-b-2 border-slate-300 h-12 flex items-end justify-center pb-1">
                <span className="text-xs font-mono font-bold text-slate-700">{studentName || "Applicant Signature"}</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Applicant Signature</p>
            </div>

            {/* Program Coordination Office Signature */}
            <div className="flex flex-col items-center text-center space-y-2 relative">
              {status === "Approved" && (
                <div className="absolute -top-12 border-2 border-dashed border-sky-600/50 bg-sky-50/90 rounded-xl p-2 flex items-center gap-2 pointer-events-none">
                  <div className="w-7 h-7 rounded-full border border-sky-600 flex items-center justify-center text-sky-700 bg-sky-100 shrink-0">
                    <Award size={14} />
                  </div>
                  <div>
                    <p className="text-[8.5px] font-black tracking-widest text-sky-900 uppercase">Office Verified</p>
                    <p className="text-[6.5px] text-sky-600 font-mono">{requestDate}</p>
                  </div>
                </div>
              )}
              <div className="w-full border-b-2 border-slate-300 h-12 flex items-end justify-center pb-1">
                <span className="text-xs font-mono font-bold text-slate-600">Coordination Office</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Signature (Coordination Office)</p>
            </div>

            {/* HOD Approval Signature */}
            <div className="flex flex-col items-center text-center space-y-2 relative">
              {status === "Approved" && (
                <div className="absolute -top-12 border-2 border-dashed border-emerald-600/50 bg-emerald-50/90 rounded-xl p-2 flex items-center gap-2 pointer-events-none">
                  <div className="w-7 h-7 rounded-full border border-emerald-600 flex items-center justify-center text-emerald-700 bg-emerald-100 shrink-0">
                    <Award size={14} />
                  </div>
                  <div>
                    <p className="text-[8.5px] font-black tracking-widest text-emerald-900 uppercase">HOD Approved</p>
                    <p className="text-[6.5px] text-emerald-600 font-mono">{requestDate}</p>
                  </div>
                </div>
              )}
              <div className="w-full border-b-2 border-slate-300 h-12 flex items-end justify-center pb-1">
                <span className="text-xs font-mono font-bold text-slate-600">HOD Approval</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Signature (HOD)</p>
            </div>
          </div>

          {/* Disapproved Notice */}
          {status === "Disapproved" && (
            <div className="border border-rose-300 bg-rose-50 text-rose-800 p-4 rounded-2xl flex items-start gap-3">
              <XCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-rose-900">Request Disapproved</p>
                {rejectionReason && (
                  <p className="text-xs text-rose-700 mt-1 italic">Reason: "{rejectionReason}"</p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2.5 bg-[#1e3a5f] hover:bg-slate-800 text-white px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? <span>Processing...</span> : <><Send size={15} /> Submit Freezing Request</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}