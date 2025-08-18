import React from 'react';
const LottieBackground = ({ variant = 'login' }) => {
  const getTitle = () => {
  switch (variant) {
    case 'login':
      return 'Welcome Back!';
    case 'signup':
      return 'Create Your Account';
    case 'verification':
      return 'Email Verification';
    case 'forgot':
      return 'Forgot Your Password?';
    case 'forgotOtp':
      return 'Enter Your Reset Code';
    case 'reset':
      return 'Set a New Password';
    default:
      return 'Welcome!';
  }
};

const getSubtitle = () => {
  switch (variant) {
    case 'login':
      return 'Log in to keep exploring your possibilities.';
    case 'signup':
      return "Let's get you set up. Join our community today!";
    case 'verification':
      return 'A verification code has been emailed to you. Please enter it to continue.';
    case 'forgot':
      return 'No worries! Enter your email to receive password reset instructions.';
    case 'forgotOtp':
      return 'Enter the code we sent in your mail to reset your password.';
    case 'reset':
      return 'Choose a strong new password to secure your account.';
    default:
      return 'Start your secure journey with us.';
  }
};

  const styles = `
    /* ... your keyframes ... */
    @keyframes float {0%,100%{transform:translateY(0px) rotate(0deg);}50%{transform:translateY(-20px) rotate(180deg);}}
    @keyframes float-reverse {0%,100%{transform:translateY(0px) rotate(0deg);}50%{transform:translateY(-15px) rotate(-180deg);}}
    @keyframes bounce-slow {0%,100%{transform:translateY(0);}50%{transform:translateY(-25%);}}
    @keyframes twinkle {0%,100%{opacity:0.3;transform:scale(0.8);}50%{opacity:1;transform:scale(1.2);}}
    @keyframes fade-in {from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
    @keyframes fade-in-delay {0%{opacity:0;transform:translateY(20px);}60%{opacity:0;transform:translateY(20px);}100%{opacity:1;transform:translateY(0);}}
    @keyframes slide-right {from{width:0;}to{width:4rem;}}
    @keyframes pulse-glow {0%,100%{opacity:0.4;transform:scale(1);}50%{opacity:0.8;transform:scale(1.1);}}
    @keyframes rotate-slow {from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
    @keyframes wave {0%,100%{transform:translateX(0) translateY(0) rotate(0deg);}25%{transform:translateX(10px) translateY(-10px) rotate(90deg);}50%{transform:translateX(0) translateY(-20px) rotate(180deg);}75%{transform:translateX(-10px) translateY(-10px) rotate(270deg);}}
    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-float-reverse { animation: float-reverse 4s ease-in-out infinite; }
    .animate-bounce-slow { animation: bounce-slow 3s infinite; }
    .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
    .animate-fade-in { animation: fade-in 1s ease-out; }
    .animate-fade-in-delay { animation: fade-in-delay 2s ease-out; }
    .animate-slide-right { animation: slide-right 1s ease-out forwards; }
    .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
    .animate-rotate-slow { animation: rotate-slow 20s linear infinite; }
    .animate-wave { animation: wave 8s ease-in-out infinite; }
  `;
  
  return (
    <>
      <style>{styles}</style>
      <div className="relative overflow-hidden w-full h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 min-w-[320px] max-w-[100vw]">
        {/* Animated floating elements confined to left-half */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Large floating circles */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full animate-pulse-glow"></div>
          <div className="absolute bottom-1/4 left-2/3 w-48 h-48 bg-indigo-400/20 rounded-full animate-bounce-slow"></div>
          
          {/* Moving geometric shapes */}
          <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-gradient-to-r from-blue-300/30 to-purple-300/30 rounded-lg rotate-45 animate-float"></div>
          <div className="absolute bottom-1/3 left-1/6 w-24 h-24 bg-gradient-to-r from-cyan-300/30 to-blue-300/30 rounded-full animate-float-reverse"></div>
          
          {/* Rotating elements */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-blue-300/30 rounded-full animate-rotate-slow"></div>
          <div className="absolute top-3/4 left-1/3 w-16 h-16 bg-gradient-to-r from-purple-400/40 to-pink-400/40 rounded-lg animate-wave"></div>
          
          {/* Small sparkle dots */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/40 rounded-full animate-twinkle"
              style={{
                left: `${10 + (i * 5)}%`,
                top: `${15 + (i * 4)}%`,
                animationDelay: `${i * 0.3}s`,
              }}
            ></div>
          ))}
          {/* Additional animated shapes */}
          <div className="absolute top-1/6 left-2/3 w-20 h-20 bg-gradient-to-r from-blue-500/25 to-cyan-500/25 rounded-full animate-bounce-slow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/6 left-1/2 w-28 h-28 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-lg rotate-12 animate-float" style={{ animationDelay: '2s' }}></div>
          {/* Floating triangles */}
          <div className="absolute top-2/3 left-3/4 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent border-b-blue-300/30 animate-wave" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/5 left-2/3 w-0 h-0 border-l-[15px] border-r-[15px] border-b-[25px] border-l-transparent border-r-transparent border-b-purple-300/30 animate-float-reverse" style={{ animationDelay: '1.5s' }}></div>
        </div>
        {/* Central animated logo/icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-full flex items-center justify-center animate-pulse-glow">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500/40 to-purple-500/40 rounded-full flex items-center justify-center animate-rotate-slow">
              <div className="w-12 h-12 bg-white/20 rounded-full animate-bounce-slow"></div>
            </div>
          </div>
        </div>
        {/* Gradient overlay confined to left-half */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800/30 to-transparent"></div>
        {/* Content overlay */}
        <div className="relative z-10 flex items-center justify-center h-full p-12">
          <div className="text-center text-white w-full">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              {getTitle()}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 font-light animate-fade-in-delay">
              {getSubtitle()}
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <div className="w-16 h-1 bg-blue-300 rounded animate-slide-right"></div>
              <div className="w-16 h-1 bg-indigo-300 rounded animate-slide-right" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-16 h-1 bg-purple-300 rounded animate-slide-right" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default LottieBackground;
