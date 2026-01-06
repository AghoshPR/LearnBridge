import React, { useState } from 'react';
import {
    Briefcase,
    GraduationCap,
    BookOpen,
    Upload,
    Phone,
    User,
    CheckCircle,
    FileText,
    Sparkles
} from 'lucide-react';
import Api from '../Services/Api';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";


const TeacherVerify = () => {
    const [teacherType, setTeacherType] = useState('fresher'); // 'fresher' or 'experienced'
    const [formData, setFormData] = useState({
        phoneNumber: '',
        qualification: '',
        subjects: '',
        bio: '',
        experienceYears: '', // Only for experienced
        resume: null
    });

    const navigate = useNavigate()

    const handleTypeChange = (type) => {
        setTeacherType(type);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, resume: e.target.files[0] });
    };

    const isValidPhoneNumber = (phone) => {
    return /^[0-9]{10}$/.test(phone);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!formData.phoneNumber.trim()) {
        toast.error("Phone number is required");
        return;
        }

        if (!isValidPhoneNumber(formData.phoneNumber)) {
        toast.error("Phone number must be exactly 10 digits");
        return;
        }

        if (!formData.qualification.trim()) {
            toast.error("Qualification is required");
            return;
        }

        if (!formData.subjects.trim()) {
            toast.error("Please enter at least one subject");
            return;
        }

        if (!formData.bio.trim()) {
            toast.error("Bio is required");
            return;
        }

        if (teacherType === "experienced" && !formData.experienceYears.trim()) {
            toast.error("Please enter your years of experience");
            return;
        }

        // Optional resume size validation (5MB)
        if (formData.resume && formData.resume.size > 5 * 1024 * 1024) {
            toast.error("Resume must be less than 5MB");
            return;
        }

        if (formData.resume) {
        const allowedTypes = ["application/pdf", "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

        if (!allowedTypes.includes(formData.resume.type)) {
            toast.error("Resume must be a PDF or Word document");
            return;
        }
        }
        

        const form = new FormData()

        form.append("teacher_type",teacherType)
        form.append("phone",formData.phoneNumber)
        form.append("qualification",formData.qualification)
        form.append("subjects",formData.subjects)
        form.append("bio",formData.bio)


        if (teacherType==="experienced"){
            form.append("years_of_experience",formData.experienceYears)
        }

        if (formData.resume){
            form.append("resume",formData.resume)
        }

        try{
            await Api.post("/teacher/profile/",form,{
                headers:{"Content-Type":"multipart/form-data"},
            })


            toast.success(
            "Profile submitted successfully, Please wait for admin approval."
        );

            navigate("/teacher/login")
        }catch(error){
            toast.error("profile submission fails")
        }





    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-2 md:p-4 font-sans">
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-8 items-center h-full">

                {/* Left Side: Info & Steps */}
                <div className="space-y-8 lg:col-span-2">

                    <div className="space-y-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl mb-2 text-emerald-600">
                            <User size={24} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                            Complete Your<br />Profile
                        </h1>
                        <p className="text-gray-500 text-lg">
                            Help us verify your credentials and get you started on LearnBridge.
                        </p>
                    </div>

                    <div className="hidden md:block space-y-4">
                        <InfoCard
                            icon={FileText}
                            title="Verification Process"
                            desc="Your details will be reviewed by our team within 24-48 hours."
                            color="bg-emerald-50 border-emerald-100"
                            iconColor="text-emerald-600"
                        />
                        <InfoCard
                            icon={Sparkles}
                            title="Get Approved"
                            desc="Once approved, you'll gain full access to create courses and teach students."
                            color="bg-teal-50 border-teal-100"
                            iconColor="text-teal-600"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                            <div className="w-8 h-2.5 rounded-full bg-emerald-500"></div>
                        </div>
                        <span className="text-xs font-semibold text-gray-400 ml-2">Step 2 of 2</span>
                    </div>

                </div>

                {/* Right Side: Form */}
                <div className="bg-white rounded-2xl shadow-xl p-5 lg:col-span-3 max-w-xl w-full mx-auto border border-gray-100">

                    {/* Teacher Type Toggle */}
                    <div className="mb-4">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block ml-1 flex items-center gap-2">
                            <GraduationCap size={14} /> Teacher Type
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => handleTypeChange('fresher')}
                                className={`flex items-center justify-center gap-2 py-2 rounded-lg border transition-all text-sm font-semibold ${teacherType === 'fresher'
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                    : 'border-gray-100 text-gray-500 hover:border-gray-200'
                                    }`}
                            >
                                <Sparkles size={18} /> Fresher
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTypeChange('experienced')}
                                className={`flex items-center justify-center gap-2 py-2 rounded-lg border transition-all text-sm font-semibold ${teacherType === 'experienced'
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                    : 'border-gray-100 text-gray-500 hover:border-gray-200'
                                    }`}
                            >
                                <Briefcase size={18} /> Experienced
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-base font-bold text-gray-900">Verification Details</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">

                        <InputGroup
                            label="Phone Number"
                            icon={Phone}
                            type="tel"
                            name="phoneNumber"
                            maxLength={10}
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                        />

                        <InputGroup
                            label="Qualification (Degree)"
                            icon={GraduationCap}
                            type="text"
                            name="qualification"
                            value={formData.qualification}
                            onChange={handleChange}
                            placeholder="e.g., B.Ed, M.Sc, PhD"
                        />

                        <InputGroup
                            label="Subjects (comma separated)"
                            icon={BookOpen}
                            type="text"
                            name="subjects"
                            value={formData.subjects}
                            onChange={handleChange}
                            placeholder="e.g., Mathematics, Physics, Chemistry"
                        />

                        {/* Bio Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                                <FileText size={12} /> Bio
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="2"
                                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium placeholder-gray-400 resize-none"
                                placeholder="Tell us about yourself, your teaching experience, and your passion for education..."
                            ></textarea>
                        </div>

                        {/* Conditional Experience Field */}
                        {teacherType === 'experienced' && (
                            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-4 duration-300">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                                    <Briefcase size={12} /> Years of Experience
                                </label>
                                <input
                                    type="text"
                                    name="experienceYears"
                                    value={formData.experienceYears}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium placeholder-gray-400"
                                    placeholder="e.g., 5 years"
                                />
                            </div>
                        )}

                        {/* File Upload */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                                <Upload size={12} /> Upload Resume (Optional)
                            </label>
                            <div className="border border-dashed border-gray-200 rounded-lg p-3 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                                <input
                                    type="file"
                                    className="hidden"
                                    id="resume-upload"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="resume-upload" className="cursor-pointer">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                        <Upload size={20} />
                                    </div>
                                    <p className="text-xs font-medium text-gray-600">Click to upload PDF or DOC</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Max file size: 5MB</p>
                                    {formData.resume && (
                                        <div className="mt-2 text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                                            <CheckCircle size={12} /> {formData.resume.name}
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all cursor-pointer mt-2 text-sm"
                        >
                            Submit for Review
                        </button>

                    </form>
                </div>

            </div>
        </div>
    );
};

// Helper Components
const InputGroup = ({ label, icon, type, name, value, onChange, placeholder }) => {
    const Icon = icon;
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                <Icon size={12} /> {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium placeholder-gray-400"
                placeholder={placeholder}
            />
        </div>
    );
};

const InfoCard = ({ icon, title, desc, color, iconColor }) => {
    const Icon = icon;
    return (
        <div className={`p-4 rounded-2xl border ${color} flex items-start gap-4`}>
            <div className={`shrink-0 p-2 rounded-lg bg-white ${iconColor}`}>
                <Icon size={20} />
            </div>
            <div>
                <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
};

export default TeacherVerify;
