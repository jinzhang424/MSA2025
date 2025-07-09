import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { LuClock4 } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import { FaRegMessage } from "react-icons/fa6";
import { BsArrowLeft } from "react-icons/bs";
import ProjectApplicationDialog from '../components/ProjectApplicationDialog';
import { getProject, type ProjectPageProps } from '../api/Project';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';

const ProjectPage = () => {
    const { id } = useParams<{ id: string; }>();
    const [project, setProject] = useState<ProjectPageProps | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector((state: RootState) => state.user);

    useEffect(() => {
        const fetchProject = async () => {
            setIsLoading(true);
            const result = await getProject(id!, user.token);
            if (!(result instanceof Error)) {
                setProject(result);
            } else {
                setProject(null);
            }
            setIsLoading(false);
        };
        fetchProject();
    }, [id, user.token]);
    
    // Loading state
    if (isLoading) {
        return <div className="bg-gray-50 min-h-screen flex justify-center items-center">
            <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading project details...</p>
            </div>
        </div>;
    }

    // Project not found
    if (!project) {
        return (
            <div className="bg-gray-50 min-h-screen py-12 px-6">
                <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>

                <p className="text-gray-600 mb-6">
                    The project you're looking for doesn't exist or has been removed.
                </p>

                <Link to="/discover-projects" className="inline-flex items-center text-purple-navy hover:text-purple-950">
                    <BsArrowLeft className="group-hover:-translate-x-1 duration-300 h-4 w-4 mr-2" />
                    Back to projects
                </Link>
                </div>
            </div>
        )
    }

    // Project Detail
    return (
        <div className="relative bg-gray-50 min-h-screen py-8 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Breadcrumb */}
                <div className="mb-6">
                <Link to="/discover-projects" className="group inline-flex items-center text-gray-600 hover:text-navy">
                    <BsArrowLeft className="group-hover:-translate-x-1 duration-300 h-4 w-4 mr-2" />
                    Back to projects
                </Link>

                </div>
                {/* Project Header */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                    <div className="h-64 relative">
                        <img src={project.image || '/project-img-replacement.png'} alt={project.title} className="w-full h-full object-cover object-center" />
                        <div className="absolute top-4 left-4 bg-navy/60 backdrop-blur-sm bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            {project.category}
                        </div>
                    </div>
                    
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                            <h1 className="text-3xl font-bold mb-4 md:mb-0">
                                {project.title}
                            </h1>
                        </div>

                        {/* Project Stats */}
                        <div className="flex flex-wrap gap-4 md:gap-8 mb-8 text-sm text-gray-600">
                            <div className="flex items-center">
                                <FiUsers className="h-5 w-5 mr-2 text-purple-600" />
                                <span>
                                {project.totalSpots} spot
                                {project.totalSpots !== 1 ? 's' : ''} available
                                </span>
                            </div>
                            {project.duration && 
                                <div className="flex items-center">
                                    <LuClock4 className="h-5 w-5 mr-2 text-purple-600" />
                                    <span>Duration: {project.duration}</span>
                                </div>
                            }
                        </div>

                        {/* Project Description */}
                        <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            Project Description
                        </h2>
                        <div className="text-gray-700 space-y-4">
                            {project.description.split('\n\n').map((paragraph: string, index: number) => <p key={index}>{paragraph}</p>)}
                        </div>
                        </div>

                        {/* Skills */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {project.skills.map((skill: string, index: number) => <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-md text-sm">
                                    {skill}
                                </span>)}
                            </div>
                        </div>

                        {/* Team */}
                        <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Team</h2>

                        {/* Team Lead */}
                        <div className="mb-4">
                            <div className="font-medium text-gray-500 mb-3">Team Lead</div>
                            <div className="flex items-center p-4 border border-gray-100 rounded-lg">
                            {
                                project?.teamLead?.image ? (
                                    <img 
                                        src={project?.teamLead?.image} 
                                        alt={`${project?.teamLead?.firstName} ${project?.teamLead?.lastName}`} 
                                        className="w-12 h-12 rounded-full object-cover mr-4" />
                                ) : (
                                    <div className='flex items-center justify-center w-12 h-12 rounded-full object-cover mr-4 bg-purple-950 text-white font-semibold text-center'>
                                        {`${project?.teamLead?.firstName[0]?.toUpperCase()}${project?.teamLead?.lastName[0]?.toUpperCase()}`}
                                    </div>
                            )}
                            <div>
                                <div className="font-medium">{`${project?.teamLead?.firstName} ${project?.teamLead?.lastName}`}</div>
                                <div className="text-sm text-gray-600">
                                {project?.teamLead?.role}
                                </div>
                            </div>
                            </div>
                        </div>
                        
                        {/* Team Members */}
                        {project?.teamMembers?.length > 0 && <div>
                            <div className="font-medium text-gray-500 mb-3">
                                Team Members
                            </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {project.teamMembers.map((member: any, index: number) => <div key={index} className="flex items-center p-4 border border-gray-100 rounded-lg">
                                        <img src={member.image} alt={member.name} className="w-10 h-10 rounded-full object-cover mr-4" />
                                        <div>
                                            <div className="font-medium">{member.name}</div>
                                            <div className="text-sm text-gray-600">
                                                {member.role}
                                            </div>
                                        </div>
                                    </div>)}
                                </div>
                            </div>}
                        </div>

                        {/* Call to Action */}
                        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row gap-4 justify-between items-center font-semibold">
                            <ProjectApplicationDialog/>
                            <button className="border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-100 flex items-center justify-center cursor-pointer w-54 duration-150">
                                <FaRegMessage className="h-5 w-5 mr-2" />
                                Contact Team Lead
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default ProjectPage;