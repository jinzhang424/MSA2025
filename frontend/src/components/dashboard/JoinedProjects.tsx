import { useState } from 'react';
import { FiUsers, FiEye, FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router';
import { type User, type ProjectMember } from '../../types/dashboard';

interface JoinedProjectsProps {
    user: User;
}

const JoinedProjects = ({ user }: JoinedProjectsProps) => {
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    // Mock data - replace with actual API calls
    const joinedProjects: ProjectMember[] = [
        {
            id: 1,
            projectId: 1,
            project: {
                id: 1,
                title: 'AI Chatbot Development',
                description: 'Building an intelligent chatbot using natural language processing',
                image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400',
                category: 'AI/ML',
                availableSpots: 1,
                totalSpots: 4,
                skills: ['Python', 'TensorFlow', 'NLP'],
                ownerId: 3,
                createdAt: '2025-05-20',
                status: 'active'
            },
            userId: user.id,
            user: user,
            role: 'member',
            joinedAt: '2025-06-10'
        },
        {
            id: 2,
            projectId: 2,
            project: {
                id: 2,
                title: 'Data Analytics Dashboard',
                description: 'Creating interactive dashboards for business intelligence',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
                category: 'Data Science',
                availableSpots: 0,
                totalSpots: 3,
                skills: ['Python', 'Pandas', 'D3.js'],
                ownerId: 2,
                createdAt: '2025-05-10',
                status: 'active'
            },
            userId: user.id,
            user: user,
            role: 'lead',
            joinedAt: '2025-05-15'
        },
        {
            id: 3,
            projectId: 3,
            project: {
                id: 3,
                title: 'Social Media App',
                description: 'Cross-platform social media application',
                image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
                category: 'Mobile Development',
                availableSpots: 0,
                totalSpots: 5,
                skills: ['React Native', 'Firebase', 'GraphQL'],
                ownerId: 3,
                createdAt: '2025-04-01',
                status: 'completed'
            },
            userId: user.id,
            user: user,
            role: 'member',
            joinedAt: '2025-04-15'
        }
    ];

    const filteredProjects = joinedProjects.filter(membership => 
        filter === 'all' || membership.project.status === filter
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'lead':
                return 'bg-purple-100 text-purple-800';
            case 'member':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleLeaveProject = (membershipId: number, projectTitle: string) => {
        if (window.confirm(`Are you sure you want to leave "${projectTitle}"?`)) {
            // TODO: Implement leave project functionality
            console.log('Leave project:', membershipId);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900">Joined Projects</h2>
                <p className="text-gray-600 mt-1">Projects you're actively participating in</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {(['all', 'active', 'completed'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            filter === status
                                ? 'bg-purple-950 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                        {status === 'all' && ` (${joinedProjects.length})`}
                        {status !== 'all' && ` (${joinedProjects.filter(m => m.project.status === status).length})`}
                    </button>
                ))}
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                    <FiUsers size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-600 mb-6">
                        {filter === 'all' 
                            ? "You haven't joined any projects yet." 
                            : `You don't have any ${filter} projects.`
                        }
                    </p>
                    {filter === 'all' && (
                        <Link
                            to="/projects"
                            className="inline-flex items-center px-4 py-2 bg-purple-950 text-white rounded-lg hover:bg-purple-900 transition-colors"
                        >
                            Discover Projects
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((membership) => {
                        const { project } = membership;
                        return (
                            <div key={membership.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                {/* Project Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <span className={`px-2 py-1 rounded-sm text-xs font-medium ${getStatusColor(project.status)}`}>
                                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                        </span>
                                        <span className={`px-2 py-1 rounded-sm text-xs font-medium ${getRoleColor(membership.role)}`}>
                                            {membership.role.charAt(0).toUpperCase() + membership.role.slice(1)}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <span className="px-2 py-1 bg-white/90 rounded-sm text-xs font-medium text-gray-700">
                                            {project.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Project Content */}
                                <div className="flex flex-col p-6 justify-between min-h-64">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                                    </div>

                                    <div>
                                        {/* Project Stats */}
                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                            <div className="flex items-center">
                                                <FiUsers size={16} className="mr-1" />
                                                {project.totalSpots - project.availableSpots}/{project.totalSpots} filled
                                            </div>
                                        </div>

                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-1 mb-4">
                                            {project.skills.slice(0, 3).map((skill) => (
                                                <span key={skill} className="px-2 py-1 bg-purple-200 text-purple-700 rounded text-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                            {project.skills.length > 3 && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                                    +{project.skills.length - 3} more
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="relative flex items-center justify-between bottom-0">
                                            <Link
                                                to={`/project/${project.id}`}
                                                className="inline-flex items-center px-3 py-2 bg-purple-950 text-white rounded-lg hover:bg-purple-900 transition-colors text-sm font-medium"
                                            >
                                                <FiEye size={14} className="mr-2" />
                                                View Project
                                            </Link>
                                            <button
                                                onClick={() => handleLeaveProject(membership.id, project.title)}
                                                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                                title="Leave Project"
                                            >
                                                <FiLogOut size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default JoinedProjects;
