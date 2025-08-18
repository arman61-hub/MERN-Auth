import React, { useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Shield, Eye, EyeOff, Camera } from "lucide-react";
import LottieBackground from "../../components/LottieBackground";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "user",
    avatar: null,
  });

  const [agreementChecked, setAgreementChecked] = useState(false);
  const [agreementError, setAgreementError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

  axios.defaults.withCredentials = true;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password" || name === "confirmPassword") setPasswordError("");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Avatar must be JPEG, PNG, or WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Avatar must be smaller than 5MB.");
      return;
    }

    setFormData((prev) => ({ ...prev, avatar: file }));

    // Reset input value to allow same file reselect
    if (fileInputRef.current) fileInputRef.current.value = "";

    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAvatarRemove = () => {
    setFormData((prev) => ({ ...prev, avatar: null }));
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`
      );
      if (data.success) {
        toast.success(data.message);
        navigate('/email-verify', { state: { email: formData.email } });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!agreementChecked) {
      setAgreementError(
        "You must agree to the Terms of Service and Privacy Policy."
      );
      return;
    } else {
      setAgreementError("");
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("password", formData.password);
      fd.append("role", formData.accountType);
      if (formData.avatar) fd.append("avatar", formData.avatar);

      const { data } = await axios.post(`${backendUrl}/api/auth/register`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        setIsLoading(false);
        setPasswordError("");
        setFormData((prev) => ({ ...prev, confirmPassword: "" }));
        setIsLoggedin(true);
        await getUserData();
        await sendVerificationOtp();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Registration failed"
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 lg:fixed lg:left-0 lg:top-0 lg:h-screen">
        <LottieBackground variant="signup" />
      </div>

      <div className="w-full lg:w-1/2 lg:ml-auto flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-blue-50 overflow-y-auto">
        <div className="w-full max-w-md mx-auto my-8 lg:my-0">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 border border-blue-100/50">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Join us and get started today
              </p>
            </div>
            <form onSubmit={onSubmitHandler} className="space-y-6" noValidate>
              {/* Avatar */}
              <div>
                <label className="block mb-2 font-semibold">
                  Avatar{" "}
                  <span className="font-normal text-gray-400">(Optional)</span>
                </label>

                <div className="flex items-center space-x-4">
                  <div className="relative shrink-0">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="w-20 h-20 rounded-full border border-gray-300 object-cover shadow"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center relative">
                        <User className="text-white" size={48} />
                        <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-blue-600 border border-white flex items-center justify-center">
                          <Camera className="text-white" size={16} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex space-x-3">
                      <label
                        htmlFor="avatar"
                        className="inline-block bg-white border border-gray-300 px-4 py-2 rounded-md shadow cursor-pointer text-blue-600 font-medium hover:bg-blue-50"
                      >
                        Choose File
                        <input
                          id="avatar"
                          type="file"
                          accept="image/jpeg, image/png, image/webp"
                          onChange={handleAvatarChange}
                          ref={fileInputRef}
                          className="hidden"
                          disabled={isLoading}
                        />
                      </label>

                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={handleAvatarRemove}
                          className="px-4 py-2 bg-red-100 border border-red-300 rounded-md text-red-600 font-medium shadow hover:bg-red-200"
                          disabled={isLoading}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <span className="mt-2 text-gray-500 text-xs">
                      JPEG, PNG, or WebP. Max 5MB.
                    </span>
                  </div>
                </div>
              </div>

              {/* Other form inputs */}
              <div>
                <label className="block mb-2 font-semibold">Account Type</label>
                <select
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 bg-white py-2 px-3"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    className="w-full pl-12 pr-12 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className={`w-full pl-12 pr-12 py-3 sm:py-4 border rounded-xl focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base ${
                      passwordError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-red-600 text-xs mt-1">{passwordError}</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agreement"
                  checked={agreementChecked}
                  onChange={(e) => setAgreementChecked(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 flex-shrink-0"
                />
                <label
                  htmlFor="agreement"
                  className="ml-2 text-xs sm:text-sm text-gray-600 cursor-pointer"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
              {agreementError && (
                <p className="text-red-600 text-xs mt-1">{agreementError}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm sm:text-base">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
