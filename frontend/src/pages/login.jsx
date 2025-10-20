import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ElderlyContext } from '../context/context'; // Adjust path if needed

const Login = () => {
  // --- Get state and functions from context ---
  const { signin, signup, isAuthenticated, error: authError } = useContext(ElderlyContext);
  const navigate = useNavigate();

  // --- Component State ---
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '', // Keep username for signup
    email: '',    // Use email for both login and signup
    telephone: '',
    password: '',
    confirmPassword: '',
    role: 'caregiver' // Default role for signup
  });

  // --- Effect for Redirection ---
  useEffect(() => {
    // This effect runs whenever 'isAuthenticated' changes.
    // If the user becomes authenticated, redirect them to the homepage.
    if (isAuthenticated) {
      console.log("Authentication state is true, redirecting to /");
      navigate('/');
    }
    // Dependency array: only re-run effect if isAuthenticated or navigate changes
  }, [isAuthenticated, navigate]);

  // --- Handlers ---
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // --- Login Logic ---
        const credentials = {
          email: formData.email,
          password: formData.password
        };
        console.log('Attempting Login:', credentials);
        await signin(credentials); // Call signin from context
        // Login successful state update will trigger useEffect for redirect
        console.log('Signin function completed');

      } else {
        // --- Signup Logic ---
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match!"); // Simple validation
          return;
        }
        const userData = {
          username: formData.username,
          email: formData.email,
          telephone: formData.telephone,
          password: formData.password,
          role: formData.role
        };
        console.log('Attempting Signup:', userData);
        await signup(userData); // Call signup from context
        // Signup successful state update will trigger useEffect for redirect
        console.log('Signup function completed');
      }
    } catch (err) {
      // Error is set in the context and displayed below
      console.error('Authentication Error in Component:', err);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Reset form fields when toggling
    setFormData({
      username: '',
      email: '',
      telephone: '',
      password: '',
      confirmPassword: '',
      role: 'caregiver'
    });
    // Consider clearing errors too if needed (though context might handle this)
  };

  // --- JSX ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Elderly Care
          </h1>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)] px-4 py-12">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">

          {/* Left Side - Information Panel */}
          <div className="hidden md:block space-y-8 px-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Welcome to <br />
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Elderly Care System
                </span>
              </h2>
              <p className="text-gray-600 text-lg">
                Providing compassionate and comprehensive care management for your loved ones.
              </p>
            </div>
            {/* Feature Highlights */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                   <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <div>
                   <h3 className="font-semibold text-gray-900 mb-1">Health Tracking</h3>
                   <p className="text-sm text-gray-600">Monitor vitals and medical history in real-time</p>
                 </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                 <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 </div>
                 <div>
                   <h3 className="font-semibold text-gray-900 mb-1">Smart Scheduling</h3>
                   <p className="text-sm text-gray-600">Automated reminders for medications and appointments</p>
                 </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                 <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                   <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                 </div>
                 <div>
                   <h3 className="font-semibold text-gray-900 mb-1">Family Connection</h3>
                   <p className="text-sm text-gray-600">Stay connected with caregivers and family members</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Card Header */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="text-blue-100">
                {isLogin ? 'Enter your credentials to continue' : 'Fill in your details to get started'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {/* --- Display Auth Error --- */}
              {authError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{authError}</span>
                </div>
              )}

              {/* Role Selection (Signup only) */}
              {!isLogin && (
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm"> I am a </label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                     </div>
                     <select
                       name="role" value={formData.role} onChange={handleInputChange} required
                       className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
                     >
                       <option value="caregiver">Caregiver</option>
                       <option value="family">Family Member</option>
                     </select>
                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                       <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                     </div>
                  </div>
                </div>
              )}

              {/* Username (Signup only) */}
              {!isLogin && (
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm"> Username </label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                     </div>
                     <input
                       type="text" name="username" value={formData.username} onChange={handleInputChange}
                       placeholder="Enter your username" required
                       className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                     />
                  </div>
                </div>
              )}

              {/* Email (Login and Signup) */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm"> Email Address </label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                   </div>
                   <input
                     type="email" name="email" value={formData.email} onChange={handleInputChange}
                     placeholder="your.email@example.com" required
                     className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                   />
                </div>
              </div>

              {/* Telephone (Signup only) */}
              {!isLogin && (
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm"> Telephone Number </label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                     </div>
                     <input
                       type="tel" name="telephone" value={formData.telephone} onChange={handleInputChange}
                       placeholder="+254 712 345 678" required
                       className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                     />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700 text-sm"> Password </label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                   </div>
                   <input
                     type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange}
                     placeholder="Enter your password" required
                     className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                   />
                   <button
                     type="button" onClick={() => setShowPassword(!showPassword)}
                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
                   >
                     {showPassword ? (
                       <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                     ) : (
                       <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                     )}
                   </button>
                </div>
              </div>

              {/* Confirm Password (Signup only) */}
              {!isLogin && (
                <div>
                  <label className="block mb-2 font-semibold text-gray-700 text-sm"> Confirm Password </label>
                  <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                     </div>
                     <input
                       type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange}
                       placeholder="Confirm your password" required
                       className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:border-blue-500 focus:outline-none transition-colors"
                     />
                  </div>
                </div>
              )}

              {/* Remember Me & Forgot Password (Login only) */}
              {isLogin && (
                <div className="flex items-center justify-between">
                   <label className="flex items-center cursor-pointer">
                     <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                     <span className="ml-2 text-sm text-gray-600">Remember me</span>
                   </label>
                   <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                     Forgot Password?
                   </a>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3.5 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>

              {/* Toggle Login/Signup */}
              <div className="text-center pt-2">
                <p className="text-gray-600 text-sm">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button" onClick={toggleMode}
                    className="ml-2 text-blue-600 hover:text-blue-700 font-bold hover:underline"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;