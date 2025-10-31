import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../userSlice';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react'

function Login() {
  const [isPassVisivle, setPassVisivle] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange'
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const result = await dispatch(loginUser(data)).unwrap();
      const userRole = result.role;

      // Success toast
      toast.success('Login successful! Redirecting...', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Navigate based on role
      if (userRole === 'student') {
        navigate('/student');
      } else if (userRole === 'educator') {
        navigate('/educator');
      } else {
        navigate('/dashboard');
      }

      reset();
    } catch (error) {
      console.error('Login failed:', error);

      // Error toast with custom message
      const errorMessage = error.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Brand with Background Image */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative">
        {/* Image Container with Margin */}
        <div
          className="absolute inset-8 rounded-2xl"
          style={{
            backgroundImage: 'url(/shared_image.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        {/* Text Content */}
        <div className="text-center relative z-10">
          <h1 className="text-7xl font-bold text-white mb-4">
            EduHub
          </h1>
          <p className="text-2xl text-white font-light">
            Empowering Education, Connecting Minds
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Brand Name */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              EduHub
            </h1>
          </div>

          {/* Form Box */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Login</h2>
              <p className="text-gray-600 mt-2">Welcome back! Please enter your details.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="form-control">
                <label htmlFor='email' className="label pb-1">
                  <span className="label-text font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </span>
                </label>
                <label className={`input validator flex items-center gap-2 w-full ${errors.email ? 'border-red-500' : ''}`}>
                  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      fill="none"
                      stroke="currentColor"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </g>
                  </svg>
                  <input
                    type="email"
                    id='email'
                    placeholder="mail@site.com"
                    className="grow"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                        message: 'Please enter a valid email address'
                      }
                    })}
                  />
                </label>
                {errors.email && (
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-4 h-4 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <p className="text-red-600 text-sm">
                      {errors.email.message}
                    </p>
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
                <label className={`input validator flex items-center gap-2 w-full ${errors.password ? 'border-red-500' : ''}`}>
                  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                      ></path>
                      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                    </g>
                  </svg>
                  <input
                    type={isPassVisivle ? 'text' : 'password'}
                    id='password'
                    placeholder="Password"
                    className="grow"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                  <span onClick={() => setPassVisivle(prev => !prev)} className='hover:cursor-pointer'>
                    {isPassVisivle ? <EyeClosed /> : <Eye />}
                  </span>
                </label>
                {errors.password && (
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-4 h-4 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <p className="text-red-600 text-sm">
                      {errors.password.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <span className="text-sm text-gray-600">Don't have an account? </span>
              <Link to="/signup" className="link link-primary text-sm font-medium no-underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
      <span style={{ display: 'none' }}>Email is required</span>
      <span style={{ display: 'none' }}>Password is required</span>

    </div>
  );
}

export default Login;