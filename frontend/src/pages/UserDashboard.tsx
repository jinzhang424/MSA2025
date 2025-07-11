import { useState } from 'react';
import { FiHome, FiFolder, FiUsers, FiFileText, FiSettings, FiMessageCircle } from 'react-icons/fi';
import { HiOutlineLogout } from 'react-icons/hi';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import MyProjects from '../components/dashboard/MyProjects';
import JoinedProjects from '../components/dashboard/JoinedProjects';
import Applications from '../components/dashboard/Applications';
import Settings from '../components/dashboard/Settings';
import Chat from '../components/dashboard/Chat';
import { type DashboardTab } from '../types/dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../store/store';
import { logout } from '../store/userSlice';
import { useNavigate } from 'react-router';

function UserDashboard() {
    const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
    const user = useSelector((state: RootState) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const sidebarItems = [
        { id: 'overview', label: 'Overview', icon: FiHome },
        { id: 'my-projects', label: 'My Projects', icon: FiFolder },
        { id: 'joined-projects', label: 'Joined Projects', icon: FiUsers },
        { id: 'applications', label: 'Applications', icon: FiFileText },
        { id: 'chat', label: 'Chat', icon: FiMessageCircle },
        { id: 'settings', label: 'Settings', icon: FiSettings },
    ];
    
    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <DashboardOverview user={user} />;
            case 'my-projects':
                return <MyProjects user={user} />;
            case 'joined-projects':
                return <JoinedProjects user={user} />;
            case 'applications':
                return <Applications user={user} />;
            case 'chat':
                return <Chat user={user} />;
            case 'settings':
                return <Settings user={user} />;
            default:
                return <DashboardOverview user={user} />;
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className={`bg-white shadow-lg transition-all duration-300 w-18 lg:w-64 flex flex-col`}>
                {/* Header */}
                <div className="flex p-4 border-b border-gray-200">
                    <div className="flex items-center gap-x-3 w-full">
                        {/* Profile picture */}
                        <div className="flex-shrink-0 w-10 h-10 bg-purple-950 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                                {user?.firstName[0]?.toUpperCase()}{user?.lastName[0]?.toUpperCase()}
                            </span>
                        </div>

                        {/* Name and email */}
                        <div className='hidden lg:block flex-1 min-w-0'>
                            <h3 className="font-semibold text-gray-900">
                                {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.id}>
                                    <button
                                        onClick={() => setActiveTab(item.id as DashboardTab)}
                                        className={`w-full flex items-center lg:px-4 lg:justify-normal justify-center px-2 py-2 rounded-lg text-left transition-colors ${
                                            activeTab === item.id
                                                ? 'bg-purple-950 text-white'
                                                : 'text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        <Icon size={20} />
                                        <span className='ml-3 hidden lg:block font-semibold'>
                                            {item.label}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center lg:px-4 lg:justify-normal justify-center px-2 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                        <HiOutlineLogout size={20} />
                        <span className='ml-3 hidden lg:block'>
                            Logout
                        </span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className={`flex-1 ${activeTab != 'chat' && 'p-6'}`}>
                {renderContent()}
            </main>
        </div>
    );
}

export default UserDashboard;
