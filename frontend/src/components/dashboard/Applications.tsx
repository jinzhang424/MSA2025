import { useState } from 'react';
import { FiClock, FiCheck, FiX, FiEye, FiUser } from 'react-icons/fi';
import { Link } from 'react-router';
import { type ProjectApplication, type IncomingApplication } from '../../types/dashboard';
import type { User } from '../../types/user';

interface ApplicationsProps {
    user: User;
}

const Applications = ({ user }: ApplicationsProps) => {
    const [activeTab, setActiveTab] = useState<'outgoing' | 'incoming'>('outgoing');

    // Mock data - replace with actual API calls
    const outgoingApplications: ProjectApplication[] = [
        {
            id: 1,
            projectId: 1,
            project: {
                id: 1,
                title: 'Blockchain Wallet App',
                description: 'Secure cryptocurrency wallet with multi-chain support',
                image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400',
                category: 'Blockchain',
                availableSpots: 2,
                totalSpots: 4,
                deadline: '2025-08-30',
                skills: ['React Native', 'Blockchain', 'Security'],
                createdBy: 1,
                createdAt: '2025-06-15',
                status: 'active'
            },
            userId: user.id,
            status: 'pending',
            appliedAt: '2025-07-02',
            message: 'I have 3+ years of experience in React Native and blockchain development. I\'ve worked on similar wallet applications and would love to contribute to this project.'
        },
        {
            id: 2,
            projectId: 2,
            project: {
                id: 2,
                title: 'IoT Smart Home System',
                description: 'Complete smart home automation system',
                image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
                category: 'IoT',
                availableSpots: 1,
                totalSpots: 3,
                deadline: '2025-09-15',
                skills: ['Arduino', 'Python', 'IoT'],
                createdBy: 2,
                createdAt: '2025-06-20',
                status: 'active'
            },
            userId: user.id,
            status: 'accepted',
            appliedAt: '2025-06-25',
            message: 'Excited to work on IoT projects. I have experience with Arduino and sensor integration.'
        },
        {
            id: 3,
            projectId: 3,
            project: {
                id: 3,
                title: 'Gaming Platform',
                description: 'Multiplayer gaming platform with real-time features',
                image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
                category: 'Gaming',
                availableSpots: 0,
                totalSpots: 5,
                deadline: '2025-08-01',
                skills: ['Unity', 'C#', 'Networking'],
                createdBy: 3,
                createdAt: '2025-06-10',
                status: 'active'
            },
            userId: user.id,
            status: 'rejected',
            appliedAt: '2025-06-28',
            message: 'I\'m passionate about game development and have created several Unity projects.'
        }
    ];

    const incomingApplications: IncomingApplication[] = [
        {
            id: '1',
            projectId: 'my-p1',
            projectTitle: 'E-commerce Platform',
            applicant: {
                id: 'app-1',
                firstName: 'Alice',
                lastName: 'Johnson',
                email: 'alice.johnson@example.com',
                profilePicture: undefined,
                skills: ['React', 'Node.js', 'PostgreSQL', 'AWS']
            },
            status: 'pending',
            appliedAt: '2025-07-03',
            message: 'I\'m a full-stack developer with 5 years of experience. I\'ve built several e-commerce platforms and would love to contribute to your project. I have expertise in React, Node.js, and cloud deployment.'
        },
        {
            id: '2',
            projectId: 'my-p1',
            projectTitle: 'E-commerce Platform',
            applicant: {
                id: 'app-2',
                firstName: 'Bob',
                lastName: 'Smith',
                email: 'bob.smith@example.com',
                profilePicture: undefined,
                skills: ['Vue.js', 'Python', 'MongoDB']
            },
            status: 'pending',
            appliedAt: '2025-07-04',
            message: 'Experienced in building scalable web applications. I can help with both frontend and backend development.'
        },
        {
            id: '3',
            projectId: 'my-p2',
            projectTitle: 'Mobile Learning App',
            applicant: {
                id: 'app-3',
                firstName: 'Carol',
                lastName: 'Davis',
                email: 'carol.davis@example.com',
                profilePicture: undefined,
                skills: ['React Native', 'Firebase', 'UI/UX']
            },
            status: 'accepted',
            appliedAt: '2025-07-01',
            message: 'I specialize in mobile app development and educational technology. I\'d be excited to work on this learning app.'
        }
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <FiClock size={16} />;
            case 'accepted':
                return <FiCheck size={16} />;
            case 'rejected':
                return <FiX size={16} />;
            default:
                return <FiClock size={16} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleApplicationAction = (applicationId: string, action: 'accept' | 'reject') => {
        // TODO: Implement application action functionality
        console.log(`${action} application:`, applicationId);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900">Applications</h2>
                <p className="text-gray-600 mt-1">Manage your project applications</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('outgoing')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'outgoing'
                                ? 'border-purple-950 text-purple-950'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        My Applications ({outgoingApplications.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('incoming')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'incoming'
                                ? 'border-purple-950 text-purple-950'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        Incoming Applications ({incomingApplications.filter(app => app.status === 'pending').length})
                    </button>
                </nav>
            </div>

            {/* Content */}
            {activeTab === 'outgoing' ? (
                <div className="space-y-4">
                    {outgoingApplications.length === 0 ? (
                        <div className="text-center py-12">
                            <FiUser size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                            <p className="text-gray-600 mb-6">You haven't applied to any projects yet.</p>
                            <Link
                                to="/projects"
                                className="inline-flex items-center px-4 py-2 bg-purple-950 text-white rounded-lg hover:bg-purple-900 transition-colors"
                            >
                                Discover Projects
                            </Link>
                        </div>
                    ) : (
                        outgoingApplications.map((application) => (
                            <div key={application.id} className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-start space-x-4">
                                    <img
                                        src={application.project.image}
                                        alt={application.project.title}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        {/* Header and status */}
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {application.project.title}
                                            </h3>

                                            <div className={`flex items-center space-x-2 px-2 py-1 rounded-md ${getStatusColor(application.status)}`}>
                                                {getStatusIcon(application.status)}
                                                <span className='text-xs font-medium'>
                                                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3">{application.project.description}</p>
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {application.project.skills.map((skill) => (
                                                <span key={skill} className="px-2 py-1 bg-purple-200 text-purple-700 rounded-md text-xs">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                        {application.message && (
                                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                                <p className="text-sm text-gray-700 italic">"{application.message}"</p>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between text-sm text-gray-100">
                                            <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                                            <Link
                                                to={`/project/${application.project.id}`}
                                                className="flex items-center bg-purple-950 hover:bg-purple-800 font-semibold px-4 py-2 rounded-md"
                                            >
                                                <FiEye size={16} className="mr-2 mt-0.5" />
                                                View Project
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {incomingApplications.length === 0 ? (
                        <div className="text-center py-12">
                            <FiUser size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications received</h3>
                            <p className="text-gray-600">No one has applied to your projects yet.</p>
                        </div>
                    ) : (
                        incomingApplications.map((application) => (
                            <div key={application.id} className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-purple-950 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                            {application.applicant.firstName[0]}{application.applicant.lastName[0]}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {application.applicant.firstName} {application.applicant.lastName}
                                                </h3>
                                                <p className="text-sm text-gray-600">{application.applicant.email}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">Applied to: <span className="font-medium">{application.projectTitle}</span></p>
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {application.applicant.skills.map((skill) => (
                                                <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                        {application.message && (
                                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                                <p className="text-sm text-gray-700 italic">"{application.message}"</p>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                Applied {new Date(application.appliedAt).toLocaleDateString()}
                                            </span>
                                            {application.status === 'pending' && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleApplicationAction(application.id, 'reject')}
                                                        className="px-3 py-1 text-sm border-2 border-red-700 text-red-700 rounded hover:bg-red-700 hover:text-gray-50 transition-colors font-semibold"
                                                    >
                                                        Reject
                                                    </button>
                                                    <button
                                                        onClick={() => handleApplicationAction(application.id, 'accept')}
                                                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-semibold"
                                                    >
                                                        Accept
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Applications;
