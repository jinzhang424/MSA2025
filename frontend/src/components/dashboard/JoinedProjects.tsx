import { useState } from 'react';
import { FiUsers, FiEye, FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router';
import { type User } from '../../types/dashboard';
import { getJoinedProjectsCardData, removeUserFromProject } from '../../api/Project';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import StateDisplay from '../StateDisplay';

interface JoinedProjectsProps {
    user: User;
}

/**
 * 
 * Shows all the projects the user has joined and allows the user to manage them (e.g. leave project)
 * @returns the JoinedProjects ui
 */
const JoinedProjects = ({ user }: JoinedProjectsProps) => {
    const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');

    // Getting the projects the user has joined
    const {
        data: joinedProjects = [], 
        isLoading,
        isError,
        error,
        refetch: refetchJoinedProjects
    } = useQuery({
        queryKey: ["joinedProjects", user.token],
        queryFn: () => getJoinedProjectsCardData(user.token)
    })

    if (isError) {
        console.error("Error occurred while fetching joined projects", error);
    }

    const filteredProjects = joinedProjects.filter(member => 
        filter === 'All' || member.status === filter
    );

    // Determining the status color 
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Completed':
                return 'bg-blue-100 text-blue-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Determining the role color
    const getRoleColor = (role: string) => {
        switch (role) {
            case 'Lead':
                return 'bg-purple-100 text-purple-800';
            case 'Member':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const leaveProject = useMutation({
        mutationFn: removeUserFromProject,
        onSuccess: () => {
            refetchJoinedProjects();
            toast.success("Successfully left from project");
        },
        onError: (e:any) => {
            toast.error(e.response?.data || "Unknown error occurred while leaving project");
            console.error("Error while leaving project", e)
        }
    })

    const handleLeaveProject = async (projectId: number) => {
        leaveProject.mutate({
            userId: user.id, 
            projectId: projectId, 
            token: user.token
        })
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
                {(['All', 'Active', 'Completed'] as const).map((status) => (
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
                        {status === 'All' && ` (${joinedProjects.length})`}
                        {status !== 'All' && ` (${joinedProjects.filter(m => m.status === status).length})`}
                    </button>
                ))}
            </div>

            {/* Projects Grid */}
            <div className='flex flex-1 w-full justify-center items-center'>
                <StateDisplay
                    isLoading={isLoading}
                    isError={isError}
                    errorMsg='Error while loading your joined projects.'
                    isEmpty={filteredProjects.length == 0 || true}
                    emptyMsg='You have not joined any projects or do not have any projects with this status.'
                >
                    {filteredProjects.length === 0 ? (
                        <div className="text-center py-12">
                            <FiUsers size={48} className="mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                            <p className="text-gray-600 mb-6">
                                {filter === 'All' 
                                    ? "You haven't joined any projects yet." 
                                    : `You don't have any ${filter} projects.`
                                }
                            </p>
                            {filter === 'All' && (
                                <Link
                                    to="/discover-projects"
                                    className="inline-flex items-center px-4 py-2 bg-purple-950 text-white rounded-lg hover:bg-purple-900 transition-colors"
                                >
                                    Discover Projects
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map((project) => {
                                return (
                                    <div key={project.projectId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                        {/* Project Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={project.image || "project-img-replacement.png"}
                                                alt={project.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-3 left-3 flex gap-2">
                                                <span className={`px-2 py-1 rounded-sm text-xs font-medium ${getStatusColor(project.status)}`}>
                                                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                                </span>
                                                <span className={`px-2 py-1 rounded-sm text-xs font-medium ${getRoleColor(project.role)}`}>
                                                    {project.role.charAt(0).toUpperCase() + project.role.slice(1)}
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
                                                        {project.spotsTaken}/{project.totalSpots}
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
                                                        to={`/project/${project.projectId}`}
                                                        className="inline-flex items-center px-3 py-2 bg-purple-950 text-white rounded-lg hover:bg-purple-900 transition-colors text-sm font-medium"
                                                    >
                                                        <FiEye size={14} className="mr-2" />
                                                        View Project
                                                    </Link>
                                                    <button
                                                        onClick={() => handleLeaveProject(project.projectId)}
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
                </StateDisplay>
            </div>
        </div>
    );
};

export default JoinedProjects;
