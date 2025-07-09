import { useEffect, useState } from 'react';
import { FiFolder, FiUsers, FiFileText, FiTrendingUp } from 'react-icons/fi';
import type { User } from '../../types/dashboard';
import { getUserStats, type UserStats } from '../../api/Project';
import { getRecentApplications, type RecentApplications } from '../../api/ProjectApplication';

interface DashboardOverviewProps {
    user: User;
}

const DashboardOverview = ({ user }: DashboardOverviewProps) => {
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [recentApplications, setRecentApplications] = useState<RecentApplications[]>([]);
    const [recentLoading, setRecentLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const data = await getUserStats(user.token);
                setStats(data);
            } catch (error) {
                console.error('Error fetching user stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user.token]);

    useEffect(() => {
        const fetchRecentApplications = async () => {
            setRecentLoading(true);
            try {
                const data = await getRecentApplications(3, user.token);
                setRecentApplications(data);
            } catch (error) {
                console.error('Error fetching recent applications:', error);
            } finally {
                setRecentLoading(false);
            }
        };
        fetchRecentApplications();
    }, [user.token]);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
    }

    if (!stats) {
        return <div className="p-8 text-center text-gray-500">No stats available</div>;
    }

    let upcomingDeadlines = [
        {
            id: 1,
            projectName: 'E-commerce Platform',
            deadline: '2025-07-15',
            daysLeft: 9,
            type: 'created'
        },
        {
            id: 2,
            projectName: 'Mobile Learning App',
            deadline: '2025-07-20',
            daysLeft: 14,
            type: 'joined'
        },
        {
            id: 3,
            projectName: 'Data Analytics Dashboard',
            deadline: '2025-07-25',
            daysLeft: 19,
            type: 'joined'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-950 to-orange-400 rounded-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">
                    Welcome back, {user.firstName}! 👋
                </h2>
                <p className="text-purple-100">
                    You have {stats.pendingApplications} pending applications and {upcomingDeadlines.length} upcoming deadlines.
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
                {/* Recent Applications */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {recentLoading ? (
                                <div className="text-center text-gray-400">Loading recent applications...</div>
                            ) : recentApplications.length === 0 ? (
                                <div className="text-center text-gray-400">No recent applications found.</div>
                            ) : recentApplications.map((application) => (
                                <div key={application.id} className="flex items-start space-x-3">
                                    <div className="w-10 h-10 bg-purple-950 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                            {application.applicantName.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-medium text-gray-900">
                                                {application.applicantName}
                                            </h4>
                                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                                application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">Applied to: {application.projectName}</p>
                                        <div className="flex flex-wrap gap-1 mt-2">
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
                        </div>
                    </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {upcomingDeadlines.map((deadline) => (
                                <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">
                                            {deadline.projectName}
                                        </h4>
                                        <p className="text-xs text-gray-500">
                                            {deadline.type === 'created' ? 'Created by you' : 'Joined project'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-medium ${
                                            deadline.daysLeft <= 7 ? 'text-red-600' :
                                            deadline.daysLeft <= 14 ? 'text-orange-600' :
                                            'text-green-600'
                                        }`}>
                                            {deadline.daysLeft} days left
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(deadline.deadline).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
