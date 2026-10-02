
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React, { useState } from 'react';
import { motion } from "framer-motion";
import { KeyRound, User, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import UniversalInput from "@/components/textsComponents/universalInput";
import { useAuth } from '@/src/hooks/authHook/useAuth';

interface ForgetPasswordPageProps {
  onBack?: () => void;
}

export default function ForgetPasswordPage({ onBack }: ForgetPasswordPageProps) {
   const { forgotPassword } = useAuth();
  const [sapId, setSapId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Error tabhi dikhega jab confirm password mein kuch likha ho AUR woh newPassword se match na kare
  const isPasswordMismatch = confirmPassword.trim().length > 0 && newPassword !== confirmPassword;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Form Validation
    if (!sapId.trim()) {
      setError("SAP ID is required");
      return;
    }

    if (!newPassword.trim()) {
      setError("New password is required");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const result = await forgotPassword(sapId.trim(), newPassword);

      if (!result.success) {
        throw new Error(result.error || "Failed to update password");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(
        err.message || "Failed to update password. Please check the SAP ID and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 -mt-6"
    >
      {/* Top Header Section */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-4 ml-1">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] text-[#FDB813] shadow-md shadow-slate-200 shrink-0">
            <KeyRound size={26} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#1e3a5f]">Manage & Reset Password</h2>
            <p className="text-xs font-medium text-slate-400 mt-0.5">Update user credentials directly via SAP ID</p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white p-10 sm:p-12 rounded-[2.5rem] shadow-xl border border-slate-100">

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[1.5rem] flex items-center gap-3">
            <AlertCircle size={20} className="text-red-500 shrink-0" />
            <p className="text-red-600 text-sm font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Success State */}
        {isSuccess ? (
          <div className="space-y-8">
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-[2rem] flex items-start gap-4">
              <CheckCircle2 size={24} className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-emerald-700 text-xs sm:text-sm font-medium leading-relaxed">
                Password has been successfully updated for SAP ID: <span className="font-bold underline">{sapId}</span>. The user can now log in using this new password.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setSapId("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-[2rem] font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition-all cursor-pointer"
              >
                Reset Another Password
              </button>
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex-1 py-4 bg-[#1e3a5f] text-white rounded-[2rem] font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all shadow-xl cursor-pointer"
                >
                  Back to Overview
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Form */
          <form className="space-y-8" onSubmit={handleUpdatePassword}>
            <div className="space-y-6">
              <UniversalInput
                label="User SAP ID"
                type="text"
                placeholder="xxxxx"
                value={sapId}
                onChange={setSapId}
                Icon={User}
                disabled={isLoading}
              />

              <UniversalInput
                label="New Password"
                type="password"
                placeholder="Enter new secure password"
                value={newPassword}
                onChange={setNewPassword}
                Icon={Lock}
                disabled={isLoading}
              />

              <div>
                <UniversalInput
                  label="Confirm New Password"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  Icon={Lock}
                  disabled={isLoading}
                />
                {/* Show error only when user types something mismatched */}
                {isPasswordMismatch && (
                  <p className="text-red-500 text-[11px] font-medium mt-1.5 ml-4 animate-fadeIn">
                    Passwords do not match
                  </p>
                )}
              </div>
            </div>

            {/* Managed Buttons Box */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 pt-4">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="w-full sm:w-auto px-10 py-4 bg-slate-100 text-slate-600 rounded-[2rem] font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-200 transition-all text-center cursor-pointer"
                >
                  Cancel
                </button>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-12 py-4 bg-[#1e3a5f] text-white rounded-[2rem] font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-[#FDB813] hover:text-[#1e3a5f] transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}