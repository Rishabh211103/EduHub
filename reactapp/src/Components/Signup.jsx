import React, { useState } from 'react';
import { checkEmail, checkMobile, userSignUp } from '../apiConfig';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeClosed } from 'lucide-react'
import { useForm } from 'react-hook-form';

function Signup() {
    const [isPasswordVisivle, setIsPasswordVisible] = useState(false)
    const [confirmPassVisible, setConfirmPassVisible] = useState(false)
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid, isDirty },
        watch,
        setError,
        clearErrors
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            userName: "",
            email: "",
            mobile: "",
            password: "",
            confirmPassword: "",
            role: ""
        }
    });

    const password = watch("password", "");

    const [globalError, setGlobalError] = useState("");
    const [isEmailChecking, setIsEmailChecking] = useState(false);
    const [isMobileExisting, setIsMobileExisting] = useState(false);

    const checkEmailExisting = async (email) => {
        if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
            return true;
        }

        setIsEmailChecking(true);
        clearErrors("email");

        try {
            const { isExisting, message } = await checkEmail(email);
            setIsEmailChecking(false);
            if (isExisting) {
                return "This email is already registered.";
            }
            return true;
        } catch (error) {
            console.error("Email check failed:", error);
            setIsEmailChecking(false);
            return "Could not verify email existence. Please try again.";
        }
    };
    const checkMobileExisting = async (mobile) => {
        console.log(mobile)
        if (! /^[6-9][0-9]{9}$/.test(mobile)) {
            return true;
        }

        setIsMobileExisting(true);
        clearErrors("mobile");

        try {
            const { isExisting, message } = await checkMobile(mobile);
            setIsMobileExisting(false);
            if (isExisting) {
                return "This mobile number is already registered.";
            }
            return true;
        } catch (error) {
            console.error("Mobile check failed:", error);
            setIsMobileExisting(false);
            return "Could not verify mobile number existence. Please try again.";
        }
    };

    const onSubmit = async (data) => {
        setGlobalError("");

        try {
            const registrationData = {
                userName: data.userName,
                email: data.email,
                mobile: data.mobile,
                password: data.password,
                role: data.role
            };

            const response = await userSignUp(registrationData);
            console.log("Registration successful:", response);

            toast.success("User registered successfully! Redirecting to login...", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            navigate('/login');
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Registration failed. Please try again.'
            setGlobalError(errorMessage);
        } finally {
        }
    }
    return (
        <div className="flex min-h-screen">
            <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative">
                <div
                    className="absolute inset-8 rounded-2xl"
                    style={{
                        backgroundImage: 'url(/shared_image.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                ></div>

                <div className="text-center relative z-10">
                    <h1 className="text-7xl font-bold text-white mb-4 drop-shadow-lg">
                        EduHub
                    </h1>
                    <p className="text-xl text-white font-light drop-shadow-md">
                        Empowering Education, Connecting Minds
                    </p>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white overflow-y-auto">
                <div className="w-full max-w-md">
                    <div className="lg:hidden text-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            EduHub
                        </h1>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-800">Signup</h2>
                            <p className="text-gray-600 mt-2">Create your account to get started.</p>
                        </div>

                        {globalError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                    <line x1="12" y1="9" x2="12" y2="13"></line>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                                <p className="text-red-600 text-sm font-medium">{globalError}</p>
                            </div>
                        )}

                        {/* Use handleSubmit wrapper */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Username Field */}
                            <div className="form-control">
                                <label htmlFor='username' className="label pb-1">
                                    <span className="label-text font-medium text-gray-700">
                                        Username <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    id='username'
                                    placeholder="Username"
                                    {...register("userName", {
                                        required: "Username is required",
                                    })}
                                    className={`input input-bordered w-full ${errors.userName ? 'border-red-500' : ''}`}
                                    style={{
                                        height: '3rem',
                                        minHeight: '3rem'
                                    }}
                                />
                                {errors.userName && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <svg className="w-4 h-4 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                            <line x1="12" y1="9" x2="12" y2="13"></line>
                                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                        </svg>
                                        <p className="text-red-600 text-sm">{errors.userName.message}</p>
                                    </div>
                                )}
                            </div>

                            <div className="form-control">
                                <label htmlFor='email' className="label pb-1">
                                    <span className="label-text font-medium text-gray-700">
                                        Email <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    id='email'
                                    placeholder="example@gmail.com"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                                            message: "Please enter a valid email address"
                                        },
                                        validate: checkEmailExisting
                                    })}
                                    className={`input input-bordered w-full ${errors.email ? 'border-red-500' : ''}`}
                                    style={{
                                        height: '3rem',
                                        minHeight: '3rem'
                                    }}
                                />
                                {errors.email && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <svg className="w-4 h-4 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                            <line x1="12" y1="9" x2="12" y2="13"></line>
                                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                        </svg>
                                        <p className="text-red-600 text-sm">{errors.email.message}</p>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Field */}
                            <div className="form-control">
                                <label htmlFor='mobile' className="label pb-1">
                                    <span className="label-text font-medium text-gray-700">
                                        Mobile <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <input
                                    type="tel"
                                    id='mobile'
                                    placeholder="Mobile Number"
                                    {...register("mobile", {
                                        required: "Mobile number is required",
                                        pattern: {
                                            value: /^[6-9][0-9]{9}$/,
                                            message: "Mobile number must be 10 digits and start with 6, 7, 8, or 9"
                                        },
                                        validate: (value) => checkMobileExisting(value)
                                    })}
                                    className={`input input-bordered w-full ${errors.mobile ? 'border-red-500' : ''}`}
                                    style={{
                                        height: '3rem',
                                        minHeight: '3rem'
                                    }}
                                    maxLength="10"
                                />
                                {/* 6. Display error using errors object */}
                                {errors.mobile && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <svg className="w-4 h-4 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                            <line x1="12" y1="9" x2="12" y2="13"></line>
                                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                        </svg>
                                        <p className="text-red-600 text-sm">{errors.mobile.message}</p>
                                    </div>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="form-control">
                                <label htmlFor='password' className="label pb-1">
                                    <span className="label-text font-medium text-gray-700">
                                        Password <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <label className='input w-full'>
                                    <input
                                        type={isPasswordVisivle ? 'text' : 'password'}
                                        id='password'
                                        placeholder="Password"
                                        // 5. Use register with validation rules
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters"
                                            }
                                        })}
                                        style={{
                                            height: '3rem',
                                            minHeight: '3rem'
                                        }}
                                    />
                                    <span onClick={() => setIsPasswordVisible(prev => !prev)} className='hover:cursor-pointer'>
                                        {isPasswordVisivle ? <EyeClosed /> : <Eye />}
                                    </span>
                                </label>

                                {/* 6. Display error using errors object */}
                                {errors.password && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <svg className="w-4 h-4 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                            <line x1="12" y1="9" x2="12" y2="13"></line>
                                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                        </svg>
                                        <p className="text-red-600 text-sm">{errors.password.message}</p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="form-control">
                                <label htmlFor='confirm' className="label pb-1">
                                    <span className="label-text font-medium text-gray-700">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <label className='input w-full'>

                                    <input
                                        type={confirmPassVisible ? 'text' : 'password'}
                                        id='confirm'
                                        placeholder="Confirm Password"
                                        // 5. Use register with validation rules
                                        {...register("confirmPassword", {
                                            required: "Confirm password is required",
                                            validate: value =>
                                                value === password || "Passwords do not match"
                                        })}
                                        style={{
                                            height: '3rem',
                                            minHeight: '3rem'
                                        }}
                                    />
                                    <span onClick={() => setConfirmPassVisible(prev => !prev)} className='hover:cursor-pointer'>
                                        {confirmPassVisible ? <EyeClosed /> : <Eye />}
                                    </span>
                                </label>

                                {/* 6. Display error using errors object */}
                                {errors.confirmPassword && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <svg className="w-4 h-4 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                            <line x1="12" y1="9" x2="12" y2="13"></line>
                                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                        </svg>
                                        <p className="text-red-600 text-sm">{errors.confirmPassword.message}</p>
                                    </div>
                                )}
                            </div>

                            {/* Role Field */}
                            <div className="form-control">
                                <label htmlFor='role' className="label pb-1">
                                    <span className="label-text font-medium text-gray-700">
                                        Role <span className="text-red-500">*</span>
                                    </span>
                                </label>
                                <select
                                    id='role'
                                    // 5. Use register with validation rules
                                    {...register("role", {
                                        required: "Role is required"
                                    })}
                                    className={`select select-bordered w-full ${errors.role ? 'border-red-500' : ''}`}
                                    style={{
                                        height: '3rem',
                                        minHeight: '3rem'
                                    }}
                                >
                                    <option value="" disabled>Select Role</option>
                                    <option value="student">Student</option>
                                    <option value="educator">Educator</option>
                                </select>
                                {/* 6. Display error using errors object */}
                                {errors.role && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <svg className="w-4 h-4 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                            <line x1="12" y1="9" x2="12" y2="13"></line>
                                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                        </svg>
                                        <p className="text-red-600 text-sm">{errors.role.message}</p>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button - Same Size */}
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                style={{
                                    height: '3rem',
                                    minHeight: '3rem'
                                }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Signing up...
                                    </span>
                                ) : (
                                    'Submit'
                                )}
                            </button>
                        </form>

                        <div className="text-center mt-6">
                            <span className="text-sm text-gray-600">Already have an account? </span>
                            <Link to="/login" className="link link-primary text-sm font-medium no-underline">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <span style={{ display: 'none' }}>User Name is required</span>
            <span style={{ display: 'none' }}>Mobile Number is required</span>
            <span style={{ display: 'none' }}>Confirm Password is required</span>

        </div>
    );
}

export default Signup;