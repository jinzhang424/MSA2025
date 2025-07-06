import { FiFolder, FiUsers, FiFileText, FiTrendingUp } from 'react-icons/fi';
import { type User } from '../../types/dashboard';

interface DashboardOverviewProps {
    user: User;
}

const DashboardOverview = ({ user }: DashboardOverviewProps) => {
    // Mock data - replace with actual API calls
    const stats = {
        myProjects: 5,
        joinedProjects: 8,
        pendingApplications: 3,
        completedProjects: 12
    };

    const recentActivity = [
        {
            id: 1,
            type: 'application',
            message: 'New application received for "E-commerce Platform"',
            time: '2 hours ago',
            status: 'pending'
        },
        {
            id: 2,
            type: 'project',
            message: 'Project "Mobile App" deadline approaching',
            time: '5 hours ago',
            status: 'warning'
        },
        {
            id: 3,
            type: 'accepted',
            message: 'Your application for "AI Chatbot" was accepted',
            time: '1 day ago',
            status: 'success'
        },
        {
            id: 4,
            type: 'completed',
            message: 'Project "Portfolio Website" marked as completed',
            time: '2 days ago',
            status: 'info'
        }
    ];

    const upcomingDeadlines = [
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
            <div className="bg-gradient-to-r from-purple-950 to-purple-800 rounded-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">
                    Welcome back, {user.firstName}! 👋
                </h2>
                <p className="text-purple-100">
                    You have {stats.pendingApplications} pending applications and {upcomingDeadlines.length} upcoming deadlines.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start space-x-3">
                                    <div className={`w-2 h-2 rounded-full mt-2 ${
                                        activity.status === 'pending' ? 'bg-yellow-500' :
                                        activity.status === 'warning' ? 'bg-orange-500' :
                                        activity.status === 'success' ? 'bg-green-500' :
                                        'bg-blue-500'
                                    }`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900">{activity.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
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
