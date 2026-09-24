
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
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto w-full bg-white rounded-[2rem] p-6 sm:p-10 border border-slate-100 shadow-sm"
    >
      {/* Header */}
      <div className="mb-8 text-left">
        <div className="h-12 w-12 rounded-2xl bg-[#1e3a5f]/5 flex items-center justify-center text-[#1e3a5f] mb-4">
          <KeyRound size={24} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1e3a5f] mb-2 tracking-tight">
          Manage & Reset Password
        </h2>
        <div className="h-1.5 w-12 bg-[#FDB813] rounded-full mb-3"></div>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Enter the student or faculty member SAP ID along with their new password to update system credentials directly.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[1.2rem] flex items-center gap-3">
          <AlertCircle size={18} className="text-red-600 shrink-0" />
          <p className="text-red-600 text-xs font-medium">
            {error}
          </p>
        </div>
      )}

      {/* Success State */}
      {isSuccess ? (
        <div className="space-y-6">
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-[1.2rem] flex items-start gap-3">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-emerald-700 text-xs font-semibold leading-relaxed">
              Password has been successfully updated for SAP ID: <span className="font-bold underline">{sapId}</span>. The user can now log in using this new password.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                setIsSuccess(false);
                setSapId("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-[1.2rem] font-bold text-xs hover:bg-slate-200 transition-all"
            >
              Reset Another Password
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="flex-1 py-2.5 bg-[#1e3a5f] text-white rounded-[1.2rem] font-bold text-xs hover:bg-[#1e3a5f]/90 transition-all shadow-md shadow-blue-900/10"
              >
                Back to Overview
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Form */
        <form className="space-y-6" onSubmit={handleUpdatePassword}>
          <UniversalInput
            label="User SAP ID"
            type="text"
            placeholder="e.g. 49100"
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
              <p className="text-red-500 text-[11px] font-medium mt-1.5 ml-1 animate-fadeIn">
                Passwords do not match
              </p>
            )}
          </div>

          {/* Managed Buttons Box */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-full sm:w-auto px-5 py-2 bg-slate-100 text-slate-600 rounded-[1.2rem] font-bold text-xs hover:bg-slate-200 transition-all text-center"
              >
                Cancel
              </button>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-50 py-3 bg-[#1e3a5f] text-white rounded-[0.9rem] font-bold text-sm hover:bg-[#1e3a5f]/90 transition-all shadow-md shadow-blue-900/10 flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
}