import { useState } from 'react';
import { FiPlus, FiUsers, FiFolder } from 'react-icons/fi';
import { Link } from 'react-router';
import { type User, type Project } from '../../types/dashboard';
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import ProjectManagementDialog from './ProjectManagementDialog';

interface MyProjectsProps {
    user: User;
}

const MyProjects = ({ user }: MyProjectsProps) => {
    const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);

    const myProjects: Project[] = [
        {
            id: 1,
            title: 'E-commerce Platform',
            description: 'Building a modern e-commerce platform with React and Node.js',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
            category: 'Web Development',
            availableSpots: 2,
            totalSpots: 5,
            skills: ['React', 'Node.js', 'MongoDB'],
            ownerId: user.id,
            createdAt: '2025-06-01',
            status: 'active'
        },
        {
            id: 2,
            title: 'Mobile Learning App',
            description: 'Educational mobile app for language learning',
            image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
            category: 'Mobile Development',
            availableSpots: 0,
            totalSpots: 4,
            skills: ['React Native', 'Firebase'],
            ownerId: user.id,
            createdAt: '2025-05-15',
            status: 'active'
        },
        {
            id: 3,
            title: 'Portfolio Website',
            description: 'Personal portfolio website with modern design',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
            category: 'Web Design',
            availableSpots: 0,
            totalSpots: 2,
            skills: ['HTML', 'CSS', 'JavaScript'],
            ownerId: user.id,
            createdAt: '2025-05-01',
            status: 'completed'
        }
    ];

    const filteredProjects = myProjects.filter(project => 
        filter === 'all' || project.status === filter
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

    const handleManageProject = (project: Project) => {
        setSelectedProject(project);
        setIsManageDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsManageDialogOpen(false);
        setSelectedProject(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">My Projects</h2>
                    <p className="text-gray-600 mt-1">Projects you've created and are managing</p>
                </div>
                <Link
                    to="/create-project"
                    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-purple-950 text-white rounded-lg hover:bg-purple-900 transition-colors"
                >
                    <FiPlus size={16} className="mr-2" />
                    Create New Project
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {(['all', 'active', 'completed', 'cancelled'] as const).map((status) => (
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
                        {status === 'all' && ` (${myProjects.length})`}
                        {status !== 'all' && ` (${myProjects.filter(p => p.status === status).length})`}
                    </button>
                ))}
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                    <FiFolder size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-600 mb-6">
                        {filter === 'all' 
                            ? "You haven't created any projects yet." 
                            : `You don't have any ${filter} projects.`
                        }
                    </p>
                    {filter === 'all' && (
                        <Link
                            to="/create-project"
                            className="inline-flex items-center px-4 py-2 bg-purple-950 text-white rounded-lg hover:bg-purple-900 transition-colors"
                        >
                            <FiPlus size={16} className="mr-2" />
                            Create Your First Project
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {/* Project Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(project.status)}`}>
                                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                    </span>
                                </div>
                                <div className="absolute top-3 right-3">
                                    <span className="px-2 py-1 bg-white/90 rounded-md text-xs font-medium text-gray-700">
                                        {project.category}
                                    </span>
                                </div>
                            </div>

                            {/* Project Content */}
                            <div className="flex flex-col p-6 min-h-64 justify-between">
                                {/* Header and description */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                                </div>

                                {/* Project Info */}
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
                                            <span key={skill} className="px-2 py-1 bg-purple-200 text-purple-700 rounded text-xs">
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
                                    <button
                                        onClick={() => handleManageProject(project)}
                                        className="flex justify-center items-center text-center text-sm text-gray-50 hover:bg-purple-800 font-medium px-4 py-2 bg-purple-950 rounded-md duration-200"
                                    >
                                        <HiOutlineCog6Tooth className='w-6 h-6'/>
                                        <p className='pl-3'>Manage Project</p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Project Management Dialog */}
            {selectedProject && (
                <ProjectManagementDialog
                    project={selectedProject}
                    isOpen={isManageDialogOpen}
                    onClose={handleCloseDialog}
                />
            )}
        </div>
    );
};

export default MyProjects;
