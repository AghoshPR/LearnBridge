import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background blobs for aesthetics */}
      <div className="absolute -top-20 -left-20 sm:top-1/4 sm:left-1/4 w-[20rem] h-[20rem] md:w-[30rem] md:h-[30rem] bg-purple-600/20 rounded-full blur-[80px] md:blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 sm:bottom-1/4 sm:right-1/4 w-[20rem] h-[20rem] md:w-[30rem] md:h-[30rem] bg-blue-600/20 rounded-full blur-[80px] md:blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center px-4 sm:px-0">
        {/* Animated 404 Header */}
        <div className="relative mb-4 md:mb-8 group">
          <h1 
            className="text-[100px] sm:text-[140px] md:text-[180px] lg:text-[220px] font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 select-none drop-shadow-2xl tracking-tighter leading-none" 
            style={{ 
              animation: 'bounce 3s infinite',
              filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.3))'
            }}
          >
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <AlertCircle className="w-16 h-16 sm:w-20 sm:h-20 lg:w-[100px] lg:h-[100px] text-white/10" />
          </div>
        </div>

        {/* Messaging */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight drop-shadow-md">
          Oops! Page Not Found.
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-8 sm:mb-10 max-w-xs sm:max-w-md md:max-w-lg mx-auto leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:px-8">
          <button 
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
          
          <Link 
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-[0_0_30px_rgba(147,51,234,0.3)] hover:shadow-[0_0_40px_rgba(147,51,234,0.5)] transition-all duration-300 hover:-translate-y-1 group"
          >
            <Home size={20} className="group-hover:scale-110 transition-transform" />
            Back to Home
          </Link>
        </div>

        {/* Details / Help */}
       
      </div>
    </div>
  );
};

export default NotFound;