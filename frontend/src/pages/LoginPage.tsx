import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { RiLoginBoxLine } from 'react-icons/ri';
import BackLink from '../components/BackLink';
import { login } from '../api/Auth';
import { useNavigate } from 'react-router';
import SubmitButton from '../components/buttons/SubmitButton';
import { toast, ToastContainer } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import TextInput from '../components/inputs/TextInput';
import { getUserProfile } from '../api/User';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/userSlice';

interface LoginFormData {
    email: string;
    password: string;
}

/**
 * 
 * @returns The login page
 */
const LoginPage = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    /**
     * Adjusts the formData state when user changes the input values
     *  
     * @param e The event of the html element
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    /**
     * The mutation function that handles the login api call
     */
    const mutation = useMutation({
        mutationFn: login,
        onSuccess: async (token) => {
            localStorage.setItem('jwtToken', token);

            const user = await getUserProfile(token);

            // Setting the user's token since getUserProfile doesn't return a user token
            user.token = token;
            dispatch(setCredentials(
                user
            ))

            navigate("/dashboard")
        },
        onError: (error: any) => {
            toast.error(error.response?.data || "Unknown error occurred while logging in.");
        }
    })

    /**
     * Handles the login submission form by calling the mutation function
     * @param e The submit event
     */
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
                {/* Login section */}
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
                        <TextInput
                            label='Email Address'
                            type='email'
                            required={true}
                            placeholder='Enter your email'
                            value={formData.email}
                            onChange={handleChange}
                        />
                        
                        {/* Password */}
                        <TextInput
                            label='Password'
                            type='password'
                            required={true}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                        />

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

                {/* Bottom black fade overlay */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
        </div>
    );
};

export default LoginPage;
