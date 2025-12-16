import React, { useState } from 'react';
import bgImage from '../../assets/otp-background.jpg';

const OtpVerify = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (e) => {
        if (e.key === "Backspace") {
            if (e.target.previousSibling && e.target.value === "") {
                e.target.previousSibling.focus();
            }
        }
    };

    return (
        <div
            className="min-h-screen w-full flex flex-col items-center justify-center bg-cover bg-center relative px-4"
            style={{ backgroundImage: `url(${bgImage})` }}
        >
            {/* Overlay for better text readability if needed, though the image is dark */}
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="relative z-10 flex flex-col items-center w-full">
                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-wide drop-shadow-lg">LearnBridge</h1>

                {/* Glassmorphism Card */}
                <div className="bg-slate-900/50 backdrop-blur-lg border border-slate-700/50 p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-lg flex flex-col items-center text-center">

                    <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">Verify OTP</h2>

                    <div className="flex flex-col items-center mb-8 space-y-1">
                        <p className="text-gray-300 text-sm md:text-base">Enter the 6-digit code sent to</p>
                        <p className="text-cyan-400 text-sm md:text-base font-medium">user@example.com</p>
                    </div>

                    {/* OTP Inputs */}
                    <div className="flex gap-2 md:gap-3 mb-8 justify-center w-full">
                        {otp.map((data, index) => (
                            <input
                                className="w-10 h-12 md:w-12 md:h-14 rounded-lg bg-slate-800/50 border border-slate-600 text-white text-center text-xl md:text-2xl focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all placeholder-gray-500"
                                type="text"
                                name="otp"
                                maxLength="1"
                                key={index}
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onKeyDown={e => handleKeyDown(e)}
                                onFocus={e => e.target.select()}
                            />
                        ))}
                    </div>

                    {/* Verify Button */}
                    <button className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-cyan-500/25 hover:opacity-95 transition-all transform hover:-translate-y-0.5 mb-6 active:translate-y-0 cursor-pointer">
                        Verify
                    </button>

                    {/* Resend Link */}
                    <p className="text-gray-400 text-sm">
                        Didn't receive the code? <button className="text-cyan-400 hover:text-cyan-300 font-medium ml-1 transition-colors cursor-pointer">Resend OTP</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OtpVerify;
