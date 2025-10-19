import React, { useState, useRef, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import { FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import LottieBackground from "../../components/LottieBackground";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const otpRefs = useRef(Array(6).fill(null));

  useEffect(() => {
    if (isEmailSent && !isOtpVerified && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isEmailSent, isOtpVerified]);

  const handleOtpChange = (i, v) => {
    if (v.length > 1) return;
    const newOtp = [...otp];
    newOtp[i] = v;
    setOtp(newOtp);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus();
    }
  };

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
    const nextIndex = pasteArray.length < 6 ? pasteArray.length : 5;
    otpRefs.current[nextIndex]?.focus();
  };

  const resendOtp = async () => {
    setTimeLeft(60);
    setOtp(["", "", "", "", "", ""]);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email }
      );
      toast.success("OTP has been resent to your email");
    } catch (error) {
      toast.error("Error resending OTP.");
    }
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email }
      );
      if (data.success) {
        setIsEmailSent(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }
    setIsOtpVerified(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        {
          email,
          newPassword,
          otp: otp.join(""),
        }
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 lg:fixed lg:left-0 lg:top-0 lg:h-screen">
        {!isEmailSent && <LottieBackground variant="forgot" /> }
        {!isOtpVerified && isEmailSent && <LottieBackground variant="forgotOtp" /> }
        {isOtpVerified && isEmailSent && <LottieBackground variant="reset" /> }
      </div>
      <div className="w-full lg:w-1/2 lg:ml-auto flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-blue-100/50">
            <Link
              to="/login"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
            >
              <FaArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>

            {!isEmailSent && (
              <form onSubmit={onSubmitEmail} className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaLock className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    Forgot Password?
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    No worries, we'll send you reset instructions
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending instructions...
                    </div>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </button>
              </form>
            )}

            {!isOtpVerified && isEmailSent && (
              <form onSubmit={onSubmitOTP} className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    Enter OTP
                  </h2>
                  <p className="text-gray-600 mb-2 text-sm sm:text-base">
                    We've sent a 6-digit code to your email
                  </p>
                  <div className="flex items-center justify-center">
                    <FaEnvelope className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-blue-600 font-medium text-sm sm:text-base break-all">
                      {email}
                    </span>
                  </div>
                </div>
                <div onPaste={handlePaste}>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-4 text-center">
                    Enter 6-digit code
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
                      Resend code in{" "}
                      <span className="font-medium text-blue-600">
                        {timeLeft}s
                      </span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={resendOtp}
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Submit
                </button>
              </form>
            )}

            {isOtpVerified && isEmailSent && (
              <form onSubmit={onSubmitNewPassword} className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaLock className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    New Password
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Enter Your New Password
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                      placeholder="Enter your new password"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    "Save New Password"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
