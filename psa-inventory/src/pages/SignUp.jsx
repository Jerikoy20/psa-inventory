import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, CheckCircle, Shield } from "lucide-react";

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee");
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 3000); // Wait 3s then go to login
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Server error. Is backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-xl p-10 border border-gray-100 text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-500 mb-6">
            An email has been sent to <strong>{email}</strong>. 
            <br/><br/>
            <span className="text-orange-500 font-bold">Please wait for Admin Approval before logging in.</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create an Account</h1>
          <p className="text-gray-500">Join PSA Office Equipment Manager</p>
        </div>

        {error && <div className="text-red-500 text-sm text-center mb-4 bg-red-50 p-2 rounded">{error}</div>}

        <form onSubmit={handleSignUp} className="space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input required type="text" placeholder="Juan Dela Cruz" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl" 
                value={name} onChange={e => setName(e.target.value)} />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input required type="email" placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl" 
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Account Type</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white">
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input type={showPassword ? "text" : "password"} required placeholder="Create a password" className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl"
                value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-[#0f172a] text-white font-semibold rounded-xl py-3 hover:bg-[#1e293b] mt-4 disabled:opacity-70">
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-8 text-sm text-gray-500">
          Already have an account? <Link to="/login" className="font-semibold text-gray-900 hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}