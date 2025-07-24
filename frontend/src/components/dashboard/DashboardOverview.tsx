import { FiFolder, FiUsers, FiFileText, FiTrendingUp } from 'react-icons/fi';
import type { User } from '../../types/dashboard';
import { getUserStats } from '../../api/Project';
import { getRecentApplications } from '../../api/ProjectApplication';
import { getNotifications } from '../../api/Notifications';
import { toast, ToastContainer } from 'react-toastify';
import SpinnerLoader from '../loaders/SpinnerLoader';
import { useQuery } from '@tanstack/react-query';
import StateDisplay from '../StateDisplay';

interface DashboardOverviewProps {
    user: User;
}

/**
 * 
 * Overview of activities for the user
 * 
 * Displays:
 * - basic user stats
 * - recent events and applications
 * @returns 
 */
const DashboardOverview = ({ user }: DashboardOverviewProps) => {
    // Getting user's stats
    const {
        data: stats, 
        isError: isStatsError, 
        error: statsError, 
        isLoading: isStatsLoading
    } = useQuery({
        queryKey: ["stats", user.token],
        queryFn: () => getUserStats(user.token)
    })

    if (isStatsError) {
        console.error(statsError)
    }
    
    // Getting user's recent applications
    const {
        data: recentApplications = [], 
        isError: isRecentAppsError, 
        error: recentAppsError, 
        isLoading: isRecentAppsLoading
    } = useQuery({
        queryKey: ["recentApplications", 3, user.token],
        queryFn: async ({ queryKey }) => {
            const [, limit, token] = queryKey;
            return await getRecentApplications(limit as number, token as string);
        }
    })

    if (isRecentAppsError) {
        console.error('Error fetching your applications:', recentAppsError);
    }
    
    // Getting user's recent events (notifications)
    const {
        data: notifications = [], 
        isError: isNotifsError, 
        error: errorNotifs, 
        isLoading: isNotifsLoading
    } = useQuery({
        queryKey: ["notifications", 3, user.token],
        queryFn: async ({ queryKey }) => {
            const [, limit, token] = queryKey;
            return await getNotifications(token as string, limit as number)
        }
    }) 

    if (isNotifsError) {
        toast.error(errorNotifs.message || "Unknown error while loading recent activity");
        console.error("Error loading recent activity", errorNotifs)
    }

    if (isNotifsLoading || isRecentAppsLoading || isStatsLoading) {
        return <div className="flex justify-center items-center p-8 text-center text-gray-500">
            <SpinnerLoader/> 
            <p className='ml-2'>Loading dashboard...</p>
        </div>;
    }

    if (!stats) {
        return <div className="p-8 text-center text-gray-500">No stats available</div>;
    }

    return (
        <div className="space-y-6">
            <div className='absolute'><ToastContainer/></div>
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-950 to-orange-400 rounded-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">
                    Welcome back, {user.firstName}! 👋
                </h2>
                <p className="text-purple-100">
                    You have {stats.pendingApplications} pending applications and {notifications.length} recent events.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* My Projects */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <FiFolder size={24} />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">My Projects</h3>
                            <p className="text-2xl font-bold text-gray-900">{stats.myProjects}</p>
                        </div>
                    </div>
                </div>

                {/* Joined Projects */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <FiUsers size={24} />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Joined Projects</h3>
                            <p className="text-2xl font-bold text-gray-900">{stats.joinedProjects}</p>
                        </div>
                    </div>
                </div>

                {/* Pending Apps */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                            <FiFileText size={24} />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Pending Apps</h3>
                            <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                        </div>
                    </div>
                </div>

                {/* Completed */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                            <FiTrendingUp size={24} />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-sm font-medium text-gray-500">Completed</h3>
                            <p className="text-2xl font-bold text-gray-900">{stats.completedProjects}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Your Applications */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Your Applications</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <StateDisplay 
                                isLoading={isRecentAppsLoading} 
                                isError={isRecentAppsError} 
                                errorMsg={recentAppsError?.message || "Unknown error occurred while loading recent appliations."}
                                isEmpty = {recentApplications.length === 0}
                                emptyMsg='No applications found.'
                            >
                                {recentApplications.map((application) => (
                                    <div key={application.id} className="flex items-start space-x-3">
                                        <img 
                                            className='w-24'
                                            src={application.projectImageUrl || "project-img-replacement.png"} 
                                            alt={application.projectName} 
                                        />  
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-medium text-gray-900">
                                                    Applied to: {application.projectName}
                                                </h4>
                                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                                    application.status === 'Pending' ? 'bg-yellow-100 text-orange-700' :
                                                    application.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                </span>
                                            </div>
                                            <div className={`flex flex-wrap gap-1 mt-2 ${application.skills.length === 0 && "hidden"}`}>
                                                {application.skills.slice(0, 2).map((skill) => (
                                                    <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {application.skills.length > 2 && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                                        +{application.skills.length - 2} more
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">{application.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </StateDisplay>
                        </div>
                    </div>
                </div>

                {/* Recent Events */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <StateDisplay
                            isLoading={true} 
                            isError={isNotifsError} 
                            errorMsg={errorNotifs?.message || "Unknown error while loading recent activity"}
                            isEmpty = {notifications.length === 0}
                            emptyMsg='No recent events.'
                        >
                        {notifications.map((notification) => (
                            <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">
                                        {notification.title}
                                    </h4>
                                    <p className='text-gray-500 text-sm'>{notification.content}   </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">
                                        {new Date(notification.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                        </StateDisplay>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
