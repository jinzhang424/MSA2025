import { useState } from 'react';
import { FiPlus, FiUsers, FiFolder } from 'react-icons/fi';
import { Link } from 'react-router';
import { type User } from '../../types/dashboard';
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import ProjectManagementDialog from './ProjectManagementDialog';
import { getUserProjectCardData, type UserProjectCardProps } from '../../api/Project';
import SpinnerLoader from '../loaders/SpinnerLoader';
import { ToastContainer } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setActiveTab } from '../../store/dashboardSlice';

interface MyProjectsProps {
    user: User;
}

/**
 * Allows the user to see all their
 */
const MyProjects = ({ user }: MyProjectsProps) => {
    const [filter, setFilter] = useState<'All' | 'Active' | 'Completed' | 'cancelled'>('All');
    const [selectedProject, setSelectedProject] = useState<UserProjectCardProps | null>(null);
    const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);
    const dispatch = useDispatch();

    const {
        data: myProjects = [],
        isLoading
    } = useQuery({
        queryKey: ["myProjects"],
        queryFn: () => getUserProjectCardData(user.token)
    })

    const filteredProjects = myProjects.filter(project => 
        filter === 'All' || project.status === filter
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleManageProject = (project: UserProjectCardProps) => {
        setSelectedProject(project);
        setIsManageDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsManageDialogOpen(false);
        setSelectedProject(null);
    };

    return (
        <div className="space-y-6">
            <ToastContainer/>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">My Projects</h2>
                    <p className="text-gray-600 mt-1">Projects you've created and are managing</p>
                </div>
                <button
                    onClick={() => dispatch(setActiveTab('create-project'))}
                    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-purple-950 text-white rounded-lg hover:bg-purple-900 transition-colors"
                >
                    <FiPlus size={16} className="mr-2" />
                    Create New Project
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {(['All', 'Active', 'Completed', 'cancelled'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            filter === f
                                ? 'bg-purple-950 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        {f === 'All' && ` (${myProjects.length})`}
                        {f !== 'All' && ` (${myProjects.filter(p => p.status === f).length})`}
                    </button>
                ))}
            </div>

            {/* Projects Grid */}
            {isLoading ? (
                <SpinnerLoader className='mt-16 w-full justify-center'>Loading projects</SpinnerLoader>
            ) : filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                    <FiFolder size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                    <p className="text-gray-600 mb-6">
                        {filter === 'All' 
                            ? "You haven't created any projects yet." 
                            : `You don't have any ${filter} projects.`
                        }
                    </p>
                    {filter === 'All' && (
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
                        <div key={project.projectId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {/* Project Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={project.image || '/project-img-replacement.png'}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(project.status)}`}>
                                        {project.status ?? 'Active'}
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
                                            {project.spotsTaken}/{project.totalSpots}
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
