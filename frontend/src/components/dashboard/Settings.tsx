import { useState } from 'react';
import { FiSave, FiEye, FiEyeOff } from 'react-icons/fi';
import type { User } from '../../types/dashboard';
import { updatePassword, updateProfile } from '../../api/User';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/userSlice';
import { ToastContainer } from 'react-toastify';
import SubmitButton from '../buttons/SubmitButton';

interface SettingsProps {
    user: User;
}

export interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
    skills: string[];
}

export interface PasswordData {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const Settings = ({ user }: SettingsProps) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
    const [profileData, setProfileData] = useState<ProfileData>({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio || '',
        skills: user.skills
    });
    const [passwordData, setPasswordData] = useState<PasswordData>({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);
    const [newSkill, setNewSkill] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    
    const dispatch = useDispatch();

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addSkill = () => {
        if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
            setProfileData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setProfileData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setIsUpdating(true)
        dispatch(setCredentials({
            id: user.id,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            email: profileData.email,
            bio: profileData.bio,
            token: user.token,
            skills: profileData.skills
        })) 
        await updateProfile(profileData, user.token);
        setIsUpdating(false)
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }

        const success = await updatePassword(passwordData, user.token);
        if (success) {
            alert('Password updated successfully!');
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    };

    return (
        <div>
            <ToastContainer className="absolute"/>
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
                <p className="text-gray-600 mt-1">Manage your profile and account</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mt-6">
                <nav className="-mb-px flex space-x-8">
                    {[
                        { id: 'profile', label: 'Profile' },
                        { id: 'password', label: 'Password' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === tab.id
                                    ? 'border-purple-950 text-purple-950'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            {activeTab === 'profile' && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                        {/* Profile Picture */}
                        <div className="flex items-center space-x-6">
                            <div className="relative">
                                {profilePicture ? (
                                    <img
                                        src={profilePicture}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-24 h-24 bg-purple-950 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-xl">
                                            {profileData.firstName[0]}{profileData.lastName[0]}
                                        </span>
                                    </div>
                                )}
                                {/* Profile picture change TBD */}
                                {/* <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                                    <FiCamera size={16} className="text-gray-600" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        className="hidden"
                                    />
                                </label> */}
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
                                <p className="text-sm text-gray-600">Update your profile picture</p>
                            </div>
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent transition-all duration-200"
                                    value={profileData.firstName}
                                    onChange={handleProfileChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent transition-all duration-200"
                                    value={profileData.lastName}
                                    onChange={handleProfileChange}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent transition-all duration-200"
                                value={profileData.email}
                                onChange={handleProfileChange}
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent transition-all duration-200"
                                placeholder="Tell us about yourself..."
                                value={profileData.bio}
                                onChange={handleProfileChange}
                            />
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Skills
                            </label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {profileData.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-sm text-sm font-semibold"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="ml-2 text-purple-600 hover:text-purple-800 cursor-pointer"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    placeholder="Add a skill"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="px-6 py-2 bg-purple-950 text-white rounded-md hover:bg-purple-900 transition-colors font-semibold"
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <SubmitButton isLoading={isUpdating} className='px-6 py-3'>
                                <FiSave size={20} className="mr-2" />
                                Save Changes
                            </SubmitButton>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'password' && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Ensure your account is using a long, random password to stay secure.
                            </p>
                        </div>

                        {/* Current Password */}
                        <div>
                            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    id="oldPassword"
                                    name="oldPassword"
                                    required
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent transition-all duration-200"
                                    value={passwordData.oldPassword}
                                    onChange={handlePasswordChange}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                >
                                    {showPasswords.current ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    id="newPassword"
                                    name="newPassword"
                                    required
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent transition-all duration-200"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                >
                                    {showPasswords.new ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    required
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent transition-all duration-200"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                >
                                    {showPasswords.confirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <SubmitButton isLoading={isUpdating} className="px-6 py-3"
                            >
                                <FiSave size={20} className="mr-2" />
                                Update Password
                            </SubmitButton>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Settings;
