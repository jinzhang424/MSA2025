import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { RiLoginBoxLine } from 'react-icons/ri';
import BackLink from '../components/BackLink';
import { login } from '../api/Auth';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/userSlice';
import { useNavigate } from 'react-router';
import SubmitButton from '../components/buttons/SubmitButton';
import { toast, ToastContainer } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';

interface LoginFormData {
    email: string;
    password: string;
}

const LoginPage = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const mutation = useMutation({
        mutationFn: login,
        onSuccess: (user) => {
            dispatch(setCredentials({
                ...user
            }));

            navigate("/dashboard")
        },
        onError: (error: any) => {
            toast.error(error.response?.data || "Unknown error occurred while logging in.");
        }
    })

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        mutation.mutate({email: formData.email, password: formData.password})
    };

    return (
        <div className="min-h-screen bg-purple-950 bg-gradient-to-br from-orange-300 flex items-center justify-center p-4">
            <ToastContainer/>
            {/* Back to home button */}
            <BackLink to="/">
                Back to home
            </BackLink>

            <div className="w-full max-w-md">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center items-center mb-4">
                            <div className="bg-purple-950 p-3 rounded-full">
                                <RiLoginBoxLine className="text-white" size={32} />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to your account to continue</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent transition-all duration-200 text-gray-950"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    required
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent transition-all duration-200 text-gray-950"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-end">
                            <Link to="/forgot-password" className="text-sm text-purple-950 hover:underline font-semibold">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <SubmitButton isLoading={mutation.isPending} className='w-full py-3'>
                            Sign In
                        </SubmitButton>
                    </form>

                    {/* Sign Up Link */}
                    <div className="text-center mt-6">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-purple-950 hover:underline font-semibold">
                                Create one now
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Bottom gradient overlay */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
        </div>
    );
};

export default LoginPage;
