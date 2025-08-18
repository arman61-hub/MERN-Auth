import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

const ANIMATION_URLS = {
  login: 'https://assets3.lottiefiles.com/packages/lf20_jcikwtux.json',
  signup: 'https://assets3.lottiefiles.com/packages/lf20_dlw10cqe.json',
  verification: 'https://assets2.lottiefiles.com/private_files/lf30_etghq0hz.json',
  forgot: 'https://assets4.lottiefiles.com/packages/lf20_c4b0i44t.json',
  reset: 'https://assets3.lottiefiles.com/packages/lf20_zrqthn6o.json',
};

const fallbackAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 90,
  w: 800,
  h: 600,
  nm: "Fallback Animation",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Circle",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] },
            { t: 90, s: [360] }
          ]
        },
        p: { a: 0, k: [400, 300, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [50, 50, 100] },
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 45, s: [100, 100, 100] },
            { t: 90, s: [50, 50, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [200, 200] },
              p: { a: 0, k: [0, 0] }
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.2, 0.4, 0.8, 0.6] },
              o: { a: 0, k: 100 }
            }
          ]
        }
      ],
      ip: 0,
      op: 90,
      st: 0
    }
  ]
};

const getTitle = (variant) => {
  switch (variant) {
    case 'login': return 'Welcome Back';
    case 'signup': return 'Join Us Today';
    case 'verification': return 'Verify Your Email';
    case 'forgot': return 'Reset Password';
    case 'reset': return 'Create New Password';
    default: return 'Welcome';
  }
};

const getSubtitle = (variant) => {
  switch (variant) {
    case 'login': return 'Sign in to continue your journey';
    case 'signup': return 'Create your account and get started';
    case 'verification': return 'Check your email for verification code';
    case 'forgot': return 'We\'ll help you reset your password';
    case 'reset': return 'Enter the code we sent to your email';
    default: return 'Let\'s get started';
  }
};

const LottieBackground = ({ variant = 'login' }) => {
  const [animationData, setAnimationData] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const url = ANIMATION_URLS[variant] || ANIMATION_URLS.login;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch animation');
        return res.json();
      })
      .then(data => {
        setAnimationData(data);
        setFailed(false);
      })
      .catch(() => {
        setAnimationData(fallbackAnimation);
        setFailed(true);
      });
  }, [variant]);

  return (
    <div className="relative overflow-hidden w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Animated floating elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-blue-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 sm:w-36 md:w-48 h-24 sm:h-36 md:h-48 bg-indigo-400/20 rounded-full animate-bounce-slow"></div>
        <div className="absolute top-1/3 right-1/3 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-gradient-to-r from-blue-300/30 to-purple-300/30 rounded-lg rotate-45 animate-float"></div>
        <div className="absolute bottom-1/3 left-1/6 w-12 sm:w-18 md:w-24 h-12 sm:h-18 md:h-24 bg-gradient-to-r from-cyan-300/30 to-blue-300/30 rounded-full animate-float-reverse"></div>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 sm:w-2 h-1 sm:h-2 bg-white/40 rounded-full animate-twinkle"
            style={{
              left: `${5 + (i * 4.5)}%`,
              top: `${10 + (i * 4)}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          ></div>
        ))}
        <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-lg rotate-12 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full animate-bounce-slow" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Lottie Animation */}
      <div className="absolute inset-0 flex items-center justify-center w-full h-full">
        <div className="w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 opacity-80">
          {animationData && (
            <Lottie
              animationData={animationData}
              loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          )}
        </div>
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-slate-900/40 via-blue-900/30 to-transparent"></div>
      {/* Content overlay */}
      <div className="relative z-10 flex items-center justify-center w-full h-full p-4 sm:p-8 md:p-12">
        <div className="text-center text-white">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in leading-tight">
            {getTitle(variant)}
          </h1>
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-blue-100 font-light animate-fade-in-delay px-4">
            {getSubtitle(variant)}
          </p>
          <div className="mt-4 sm:mt-8 flex justify-center space-x-2 sm:space-x-4">
            <div className="w-8 sm:w-12 md:w-16 h-1 bg-blue-300 rounded animate-slide-right"></div>
            <div className="w-8 sm:w-12 md:w-16 h-1 bg-indigo-300 rounded animate-slide-right" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-8 sm:w-12 md:w-16 h-1 bg-purple-300 rounded animate-slide-right" style={{ animationDelay: '0.4s' }}></div>
          </div>
          {failed && (
            <p className="text-sm text-red-100 mt-8">
              Could not load animation, using fallback.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LottieBackground;
