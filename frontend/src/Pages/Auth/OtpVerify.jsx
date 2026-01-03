import React, { useEffect, useState } from 'react';
import bgImage from '../../assets/otp-background.jpg';

import Api from '../Services/Api';

import { useNavigate } from 'react-router-dom';

const OTP_EXPIRY = 60


const OtpVerify = () => {

    const [otp, setOtp] = useState(new Array(6).fill(""));

    const [timer, setTimer] = useState(OTP_EXPIRY);
    const [expired, setExpired] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate()
    const email = sessionStorage.getItem("otp_email")

    const role = sessionStorage.getItem("otp_role")



    useEffect(()=>{

        if(timer===0){
            setExpired(true)
            return
        }

        const interval = setInterval(()=>{
            setTimer((prev)=>prev-1)
        },1000)

        return ()=>clearInterval(interval)

    },[timer])


    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = [...otp]
        newOtp[index]= element.value
        setOtp(newOtp)

        // Focus next input
        if (element.nextSibling && element.value !== "") {
            element.nextSibling.focus();
        }
    };



    // Handle backspace
    const handleKeyDown = (e) => {
    if (e.key === "Backspace" && e.target.previousSibling && !e.target.value) {
      e.target.previousSibling.focus();
    }
  };

   /* ---------------- VERIFY OTP ---------------- */


   const handleVerifyOtp = async ()=>{

        if (expired){
            setError("OTP expired. Please send OTP");
            return
        }

        const enteredOtp =otp.join("");

        try{

            await Api.post("/auth/verify-otp/",{
                email,
                otp:enteredOtp,
            })

            sessionStorage.removeItem("otp_email")
            sessionStorage.removeItem("otp_role")

            if (role === "teacher") {
                navigate("/teacher/verify", { replace: true })
            } else {
                navigate("/student/login", { replace: true })
            }
            
        }

        catch(err){
            setError("invalid OTP")
        }

   }

   /* ---------------- Resend OTP ---------------- */


    const handleResendOtp = async ()=>{

        try{
            await Api.post("/auth/resend-otp/",{email})

            setOtp(new Array(6).fill(""))
            setTimer(OTP_EXPIRY)
            setExpired(false)
            setError("")
        }
        catch(err){
            setError("Failed to resend OTP")
        }
        

    }




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

                    {/* Timer */}

                    {!expired?(

                        <p className="text-gray-400 mb-4">
                        OTP expires in <span className="text-white">{timer}s</span>
                        </p>

                        ):(
                        
                        <p className="text-red-400 mb-4">OTP expired</p>
                        
                    )}

                    {/* ERROR MESSAGE */}
                    {error && <p className="text-red-500 mb-3">{error}</p>}
                    


                    {/* Verify Button */}
                    
                    <button
                    onClick={handleVerifyOtp}
                    disabled={expired}
                    className={`w-full py-3 rounded-xl font-semibold text-lg mb-4
                        ${
                        expired
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-teal-500 to-cyan-600 hover:opacity-95"
                        }`}
                    >
                    Verify
                    </button>

                    {/* RESEND OTP (only after expiry) */}

                        {expired && (
                        <button
                            onClick={handleResendOtp}
                            className="text-cyan-400 hover:text-cyan-300 text-sm"
                        >
                            Resend OTP
                        </button>
                        )}


                </div>
            </div>
        </div>
    );
};

export default OtpVerify;
