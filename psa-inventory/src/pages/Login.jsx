import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Hardcode the admin check right here
        if (email === "admin" || email === "admin@gmail.com" || email === "jerikoy2020@gmail.com") {
          sessionStorage.setItem("userRole", "admin");
          sessionStorage.setItem("userName", "Jericho Daabay");
        } else {
          // If it's a normal employee, use the backend data or default to "user"
          sessionStorage.setItem("userRole", data.role ? data.role.toLowerCase() : "user");
          sessionStorage.setItem("userName", data.name || email.split('@')[0]); 
        }
        
        navigate("/dashboard", { replace: true });
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Cannot connect to server. Is backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-xl p-8 border border-gray-100">
        
        <div className="text-center mb-8">
          <img src="psa-logo.png" 
               alt="PSA Logo" className="h-16 w-16 mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold text-gray-900">Office Equipment Manager</h1>
          <p className="text-gray-500">Sign in to continue</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-2 text-sm">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input type="email" required className="w-full pl-10 pr-4 py-3 border rounded-xl" placeholder="admin@psa.gov.ph" 
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input type={showPassword ? "text" : "password"} required className="w-full pl-10 pr-12 py-3 border rounded-xl" placeholder="••••••••" 
                value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-[#0f172a] text-white font-semibold rounded-xl py-3 hover:bg-[#1e293b] disabled:opacity-70">
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="flex items-center justify-between mt-8 text-sm">
          <Link to="/forgot-password" className="font-medium text-gray-600 hover:text-gray-900">Forgot password?</Link>
          <div className="text-gray-500">
            Need an account? <Link to="/signup" className="font-semibold text-gray-900 hover:underline">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}