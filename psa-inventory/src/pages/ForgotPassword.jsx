import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); setIsSent(true); }, 1500);
  };

  if (isSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-xl p-10 border border-gray-100 text-center">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-6"><Mail className="h-8 w-8 text-blue-600" /></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-500 mb-8">We sent a password reset link to <strong>{email}</strong></p>
          <Link to="/login" className="block w-full bg-[#0f172a] text-white font-semibold rounded-xl py-3 hover:bg-[#1e293b] transition-all">Back to Login</Link>
          <button onClick={() => setIsSent(false)} className="mt-6 text-sm text-gray-500 hover:text-gray-900 underline">Didn't receive the email? Click to resend</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
        <Link to="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Login</Link>
        <div className="mb-8"><h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1><p className="text-gray-500">Enter your email to reset password.</p></div>
        <form onSubmit={handleReset} className="space-y-5">
          <div className="space-y-1.5"><label className="block text-sm font-medium text-gray-700">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input required type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900" /></div></div>
          <button type="submit" disabled={isLoading} className="w-full bg-[#0f172a] text-white font-semibold rounded-xl py-3 hover:bg-[#1e293b] mt-2">{isLoading ? "Sending..." : "Send Reset Link"}</button>
        </form>
      </div>
    </div>
  );
}