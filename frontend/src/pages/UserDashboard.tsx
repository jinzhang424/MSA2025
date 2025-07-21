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
import { MdOutlineCreate } from "react-icons/md";
import CreateProject from '../components/dashboard/CreateProject';
import { ImCompass } from "react-icons/im";
import { DiscoverProjects } from './ProjectDiscoveryPage';
import { setActiveTab } from '../store/dashboardSlice';
import ProfileImage from '../components/ProfileImage';
import SideBarButton from '../components/buttons/SideBarButton';

/**
 * UserDashboard is the main dashboard view for authenticated users
 * 
 * It features a responsive sidebar that allows navigation between different dashboard tabs:
 * - Overview
 * - Discover Projects
 * - Create Project
 * - My Projects
 * - Joined Projects
 * - Applications
 * - Chat
 * - Settings
 * 
 * Each of these tabs are dynamically re-rendered when a user selects a tab
 * 
 * @returns The rendered dashboard component
 */
function UserDashboard() {
    const activeTab = useSelector((state: RootState) => state.dashboard.activeTab);
    const user = useSelector((state: RootState) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const sidebarItems = [
        { id: 'overview', label: 'Overview', icon: FiHome },
        { id: 'discover-projects', label: 'Discover Projects', icon: ImCompass},
        { id: 'create-project', label: 'Create Project', icon: MdOutlineCreate},
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
            case 'discover-projects':
                return <DiscoverProjects isDashboardView={true}/>;
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
            case 'create-project':
                return <CreateProject/>
            default:
                return <DashboardOverview user={user} />;
        }
    };

    /**
     * Clears the user redux state
     */
    const handleLogout = () => {
        localStorage.setItem('jwtToken', '');
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
                        <ProfileImage 
                            profileImage={user.profileImage}
                            firstName={user.firstName}
                            lastName={user.lastName}
                        />

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
                                    <SideBarButton
                                        onClick={() => dispatch(setActiveTab(item.id as DashboardTab))}
                                        className={`text-left transition-colors ${
                                            activeTab === item.id
                                                ? 'bg-purple-950 text-white'
                                                : 'text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        <Icon size={20} />
                                        <span className='lg:block hidden font-semibold'>
                                            {item.label}
                                        </span>
                                    </SideBarButton>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-200">
                    <SideBarButton 
                        className="text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors" 
                        onClick={handleLogout}
                    >
                        <HiOutlineLogout size={20} />
                        <p className='lg:block hidden'>Logout</p>
                    </SideBarButton>
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
