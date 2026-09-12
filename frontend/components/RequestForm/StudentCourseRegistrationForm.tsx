/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  Building2,
  Calendar,
  BookOpen,
  User,
  GraduationCap,
  ChevronDown,
  Award,
  XCircle,
  Hash,
  FileText
} from "lucide-react";

interface CourseRow {
  id: string;
  subjectName: string;
  courseCode: string;
  creditHours: string;
}

interface StudentCourseRegistrationFormProps {
  student?: any;
  requestData?: any;
  onBack: () => void;
}

export default function StudentCourseRegistrationForm({
  student,
  requestData,
  onBack
}: StudentCourseRegistrationFormProps) {
  const todayDate = new Date().toISOString().split("T")[0];

  const [registrationDate, setRegistrationDate] = useState(requestData?.date || todayDate);
  const [studentName, setStudentName] = useState(student?.studentName || "");
  const [cmsNo, setCmsNo] = useState(student?.User?.sapid || "");
  const [semester, setSemester] = useState(student?.currentSemester?.toString() || "");
  const [program, setProgram] = useState(student?.BatchModel?.batchName || "");
  const [semesterGpa, setSemesterGpa] = useState(requestData?.semesterGpa || "");
  const [commGpa, setCommGpa] = useState(requestData?.commGpa || "");
  const [academicStatus, setAcademicStatus] = useState<"Promoted" | "Promoted on Probation" | "Relegated">(
    requestData?.academicStatus || "Promoted"
  );

  const [courses, setCourses] = useState<CourseRow[]>(
    requestData?.courses || [
      { id: "1", subjectName: "", courseCode: "", creditHours: "3" },
      { id: "2", subjectName: "", courseCode: "", creditHours: "3" },
      { id: "3", subjectName: "", courseCode: "", creditHours: "3" }
    ]
  );

  const [totalSemesterFee, setTotalSemesterFee] = useState(requestData?.totalSemesterFee || "");
  const [feeDeposited, setFeeDeposited] = useState(requestData?.feeDeposited || "");
  const [comments, setComments] = useState(requestData?.comments || "");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const status = requestData?.status || "Pending";
  const rejectionReason = requestData?.rejectionReason || "";

  const handleAddCourse = () => {
    if (courses.length < 7) {
      setCourses([
        ...courses,
        { id: Date.now().toString(), subjectName: "", courseCode: "", creditHours: "3" },
      ]);
    }
  };

  const handleRemoveCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter((course) => course.id !== id));
    }
  };

  const handleCourseChange = (id: string, field: keyof CourseRow, value: string) => {
    setCourses(
      courses.map((course) =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
  };

  const totalCredits = courses.reduce((sum, course) => sum + (parseInt(course.creditHours) || 0), 0);

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
            Registration Submitted
          </h2>
          <p className="text-slate-500 text-sm max-w-md mb-8 leading-relaxed">
            Your Course Registration Form has been successfully submitted and routed to your Student Advisor and Fee Department.
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
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">Course Registration Form</h1>
                <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                  status === "Approved" ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30" :
                  status === "Disapproved" ? "bg-rose-400/20 text-rose-300 border border-rose-400/30" :
                  "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                }`}>
                  Status: {status}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">Riphah International University Islamabad, Pakistan — Faculty of Computing</p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Ref Code: RIPHAH/FC/XX/CENT/F-04</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Academic Info */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><GraduationCap size={20} /></div>
            <div>
              <h3 className="text-base font-bold text-[#1e3a5f]">Student Academic Information</h3>
              <p className="text-xs text-slate-400">Verify your current semester status and GPAs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                <User size={14} className="text-slate-400" /> Student Full Name
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter Full Name"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Hash size={14} className="text-slate-400" /> CMS / SAP ID
              </label>
              <input
                type="text"
                required
                value={cmsNo}
                onChange={(e) => setCmsNo(e.target.value)}
                placeholder="Enter CMS/SAP ID"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800"
              />
            </div>

            <div className="w-full relative z-20">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Semester</label>
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
                <Building2 size={14} className="text-slate-400" /> Academic Program
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
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Semester GPA</label>
              <input
                type="text"
                value={semesterGpa}
                onChange={(e) => setSemesterGpa(e.target.value)}
                placeholder="e.g. 3.50"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Cumulative GPA (Comm. GPA)</label>
              <input
                type="text"
                value={commGpa}
                onChange={(e) => setCommGpa(e.target.value)}
                placeholder="e.g. 3.42"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800"
              />
            </div>

            <div className="md:col-span-2 space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-600">Academic Status</label>
              <div className="flex flex-wrap gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {(["Promoted", "Promoted on Probation", "Relegated"] as const).map((statusOption) => (
                  <label key={statusOption} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="radio"
                      name="academicStatus"
                      checked={academicStatus === statusOption}
                      onChange={() => setAcademicStatus(statusOption)}
                      className="text-[#1e3a5f] focus:ring-[#1e3a5f]"
                    />
                    {statusOption}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><BookOpen size={20} /></div>
              <div>
                <h3 className="text-base font-bold text-[#1e3a5f]">Course Enrollment List</h3>
                <p className="text-xs text-slate-400">I will obey the RIU rules and regulations. Kindly register me in the below mentioned courses:</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 shrink-0">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5"><Calendar size={14} className="text-slate-500" /> Date:</label>
              <input
                type="date"
                required
                value={registrationDate}
                onChange={(e) => setRegistrationDate(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="space-y-3">
            {courses.map((course, idx) => (
              <div key={course.id} className="flex flex-col md:flex-row items-center gap-3 bg-slate-50/60 p-4 rounded-2xl border border-slate-200/70">
                <div className="w-8 h-8 bg-white text-[#1e3a5f] rounded-xl font-bold text-xs flex items-center justify-center shrink-0 border border-slate-100">{idx + 1}</div>
                <input
                  type="text"
                  required
                  placeholder="Subject Name (e.g. Software Architecture)"
                  value={course.subjectName}
                  onChange={(e) => handleCourseChange(course.id, "subjectName", e.target.value)}
                  className="w-full flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium"
                />
                <input
                  type="text"
                  required
                  placeholder="Course Code (e.g. SE-412)"
                  value={course.courseCode}
                  onChange={(e) => handleCourseChange(course.id, "courseCode", e.target.value)}
                  className="w-full md:w-40 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium uppercase font-mono"
                />
                <div className="w-full md:w-36 relative">
                  <select
                    value={course.creditHours}
                    onChange={(e) => handleCourseChange(course.id, "creditHours", e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-xs font-medium"
                  >
                    <option value="1">1 Cr. Hr.</option>
                    <option value="2">2 Cr. Hrs.</option>
                    <option value="3">3 Cr. Hrs.</option>
                    <option value="4">4 Cr. Hrs.</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                {courses.length > 1 && (
                  <button type="button" onClick={() => handleRemoveCourse(course.id)} className="p-2 text-slate-400 hover:text-rose-500">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 px-2">
            {courses.length < 7 && (
              <button
                type="button"
                onClick={handleAddCourse}
                className="py-2.5 px-4 border border-dashed border-slate-300 rounded-xl text-xs font-semibold text-[#1e3a5f] flex items-center gap-2 hover:bg-slate-50 transition-all"
              >
                <Plus size={16} /> Add Course
              </button>
            )}
            <div className="ml-auto bg-slate-100/80 px-4 py-2 rounded-xl text-xs font-bold text-[#1e3a5f]">
              Total Credits: <span className="text-indigo-600 font-extrabold">{totalCredits}</span>
            </div>
          </div>
        </div>

        {/* Fee & Dues Department Section */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><FileText size={20} /></div>
            <div>
              <h3 className="text-base font-bold text-[#1e3a5f]">Fee & Dues Department Verification</h3>
              <p className="text-xs text-slate-400">Financial clearance and fee details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Total Semester Fee (PKR)</label>
              <input
                type="text"
                value={totalSemesterFee}
                onChange={(e) => setTotalSemesterFee(e.target.value)}
                placeholder="e.g. 75,000"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fee Deposited (PKR)</label>
              <input
                type="text"
                value={feeDeposited}
                onChange={(e) => setFeeDeposited(e.target.value)}
                placeholder="e.g. 75,000"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Comments / Remarks</label>
              <input
                type="text"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter any fee or departmental comments..."
                className="w-full bg-slate-50/80 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Signatures & Approvals Section */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-xl space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-4">
            {/* Student Signature */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-full border-b-2 border-slate-300 h-12 flex items-end justify-center pb-1">
                <span className="text-xs font-mono font-bold text-slate-700">{studentName || "Student Signature"}</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Signature (Student)</p>
            </div>

            {/* Student Advisor Signature */}
            <div className="flex flex-col items-center text-center space-y-2 relative">
              {status === "Approved" && (
                <div className="absolute -top-12 border-2 border-dashed border-sky-600/50 bg-sky-50/90 rounded-xl p-2 flex items-center gap-2 pointer-events-none">
                  <div className="w-7 h-7 rounded-full border border-sky-600 flex items-center justify-center text-sky-700 bg-sky-100 shrink-0">
                    <Award size={14} />
                  </div>
                  <div>
                    <p className="text-[8.5px] font-black tracking-widest text-sky-900 uppercase">Advisor Approved</p>
                    <p className="text-[6.5px] text-sky-600 font-mono">{registrationDate}</p>
                  </div>
                </div>
              )}
              <div className="w-full border-b-2 border-slate-300 h-12 flex items-end justify-center pb-1">
                <span className="text-xs font-mono font-bold text-slate-600">Verified Advisor</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Signature (Student Advisor)</p>
            </div>

            {/* Finance Officer Signature */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-full border-b-2 border-slate-300 h-12 flex items-end justify-center pb-1">
                <span className="text-xs font-mono font-bold text-slate-600">Accounts Clearance</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Signature (Finance Officer)</p>
            </div>
          </div>

          {/* Disapproved Notice */}
          {status === "Disapproved" && (
            <div className="border border-rose-300 bg-rose-50 text-rose-800 p-4 rounded-2xl flex items-start gap-3">
              <XCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-rose-900">Registration Disapproved</p>
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
              {isSubmitting ? <span>Processing...</span> : <><Send size={15} /> Submit Registration Form</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}