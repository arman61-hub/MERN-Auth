import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail } from "lucide-react";
import { FaEnvelope } from "react-icons/fa";
import LottieBackground from "../../components/LottieBackground";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const EmailVerify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const otpRefs = useRef(Array(6).fill(null));
  const { backendUrl, getUserData, isLoggedin, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  useEffect(() => {
    if (isLoggedin && userData && userData.isAccountVerified) {
      navigate("/login");
    }
  }, [isLoggedin, userData, navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (i, v) => {
    if (v.length > 1) return;
    const newOtp = [...otp];
    newOtp[i] = v;
    setOtp(newOtp);
    if (v && i < 5) otpRefs.current[i + 1].focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      otpRefs.current[i - 1].focus();
    }
  };

  // New handlePaste function: fills OTP inputs on paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const pasteArray = pastedData.split("");
    const newOtp = [...otp];
    pasteArray.forEach((char, index) => {
      if (index < 6 && /[0-9]/.test(char)) {
        newOtp[index] = char;
        if (otpRefs.current[index]) otpRefs.current[index].value = char;
      }
    });
    setOtp(newOtp);
    // Focus next empty input or last input after pasting
    const nextIndex = pasteArray.length < 6 ? pasteArray.length : 5;
    if (otpRefs.current[nextIndex]) otpRefs.current[nextIndex].focus();
  };

  const resendOtp = async () => {
    setTimeLeft(60);
    setOtp(["", "", "", "", "", ""]);
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`, { email });
      toast.success("Verification code has been resent to your email");
    } catch (error) {
      toast.error("Error resending code.");
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter full 6 digit code");
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp: code });
      if (data.success) {
        toast.success("Email verified successfully! You can now login.");
        getUserData();
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 lg:fixed lg:left-0 lg:top-0 lg:h-screen">
        <LottieBackground variant="verification" />
      </div>
      <div className="w-full lg:w-1/2 lg:ml-auto flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-blue-100/50">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Verify Your Email</h2>
              <p className="text-gray-600 mb-2 text-sm sm:text-base">We've sent a 6-digit code to</p>
              <div className="flex items-center justify-center">
                <FaEnvelope className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-blue-600 font-medium text-sm sm:text-base break-all">{email}</span> 
              </div>
            </div>
            <form onSubmit={onSubmitHandler} className="space-y-6">
              <div onPaste={handlePaste}>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-4 text-center">
                  Enter 6-digit verification code
                </label>
                <div className="flex justify-center space-x-2 sm:space-x-3">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      className="w-10 sm:w-12 h-10 sm:h-12 text-center text-lg sm:text-xl font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      maxLength={1}
                      required
                    />
                  ))}
                </div>
              </div>
              <div className="text-center">
                {timeLeft > 0 ? (
                  <p className="text-xs sm:text-sm text-gray-600">
                    Resend code in <span className="font-medium text-blue-600">{timeLeft}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={resendOtp}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Resend verification code
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify Email"
                )}
              </button>
            </form>
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm sm:text-base">
                Didn't receive the code?{" "}
                <button onClick={resendOtp} className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Resend
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
