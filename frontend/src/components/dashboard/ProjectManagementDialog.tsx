import { useState } from 'react';
import { FiX, FiUsers, FiUserCheck } from 'react-icons/fi';
import { type UserProjectCardProps } from '../../api/Project';
import { getProjectMembers } from '../../api/Project';
import { acceptUserApplication, getProjectPendingApplications, rejectUserApplication } from '../../api/ProjectApplication';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import BGFadeButton from '../buttons/BGFadeButton';
import ProfileImage from '../ProfileImage';
import Spinner from '../animation/Spinner';
import ApplicationCard from '../cards/ApplicationCard';
import { formatDate } from '../../utils/formatTime';
import ProjectMemberCard from '../cards/ProjectMemberCard';

interface ProjectManagementDialogProps {
    project: UserProjectCardProps;
    isOpen: boolean;
    onClose: () => void;
}

/**
 * Allows users to manage projects by:
 * - Removing members
 * - Seeing applications and handle them (reject/accept)
 * @param param0 
 * @returns 
 */
const ProjectManagementDialog = ({ project, isOpen, onClose }: ProjectManagementDialogProps) => {
    const [activeTab, setActiveTab] = useState<'members' | 'applicants'>('members');
    const user = useSelector((state: RootState) => state.user);

    const {
        data: members = [],
        isError: isGetMembersError,
        isLoading: isLoadingMembers,
        error: getMembersError,
        refetch: refetchMembers
    } = useQuery({
        queryKey: ["members"],
        queryFn: () => getProjectMembers(project.projectId, user.token)
    })

    if (isGetMembersError) {
        toast.error("Unknown error occurred while getting project members");
        console.error("Error while getting project members", getMembersError);
    }

    const {
        data: applicants = [],
        isError: isGetPendingAppsError,
        error: getPendingAppsError,
        isLoading: isLoadingApplications,
        refetch: refetchPendingApps
    } = useQuery({
        queryKey: ["applicants"],
        queryFn: () => getProjectPendingApplications(project.projectId, user.token)
    })

    if (isGetPendingAppsError) {
        toast.error("Unknown error occurred while getting project members");
        console.error("Error while getting project members", getPendingAppsError);
    }

    const acceptApplication = useMutation({
        mutationFn: (applicantId: number) => acceptUserApplication({
            applicantId, 
            projectId: project.projectId, 
            token: user.token
        }),
        onSuccess: () => {
            refetchMembers();
            refetchPendingApps();
            toast.success("Successfully accepted applicant");
        },
        onError: (e:any) => {
            toast.error(e.response?.data || "Unknown error occurred while accepting applicant")
            console.error("Error while accepting applicant", e);
        }
    })

    const handleAcceptApplicant = async (applicantId: number) => {
        acceptApplication.mutate(applicantId);
    };

    const rejectApplication = useMutation({
        mutationFn: (applicantId: number) => rejectUserApplication({
            applicantId, 
            projectId: project.projectId, 
            token: user.token
        }),
        onSuccess: () => {
            refetchPendingApps();
            toast.success("Successfully rejected applicant");
        },
        onError: (e:any) => {
            toast.error(e.response?.data || "Unknown error occurred while rejecting applicant")
            console.error("Error while rejecting applicant", e);
        }
    })

    const handleRejectApplicant = async (applicantId: number) => {
        console.log('Reject applicant:', applicantId);
        rejectApplication.mutate(applicantId);
    };


    if (!isOpen) return null;

    console.log(applicants.length === 0)

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 bg-opacity-50 transition-opacity"
                onClick={onClose}
            />
            
            {/* Dialog */}
            <div className={`absolute inset-y-0 right-0 w-full max-w-4xl bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center space-x-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Manage Project</h2>
                                <p className="text-sm text-gray-600 mt-1">{project.title}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            <FiX size={20} />
                        </button>
                    </div>

                    {/* Project Summary */}
                    <div className="p-6 border-b border-gray-200 bg-white">
                        <div className="flex items-center space-x-6">
                            <img
                                src={project.image || "./project-img-replacement.png"}
                                alt={project.title}
                                className="w-16 h-16 rounded-md object-cover"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{project.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <FiUsers size={14} className="mr-1" />
                                        {project.spotsTaken}/{project.totalSpots} members
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('members')}
                            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                                activeTab === 'members'
                                    ? 'text-purple-950 border-b-2 border-purple-950 bg-purple-50'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <FiUsers size={16} />
                                <span>Members ({members.length})</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('applicants')}
                            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                                activeTab === 'applicants'
                                    ? 'text-purple-950 border-b-2 border-purple-950 bg-purple-50'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <FiUserCheck size={16} />
                                <span>Applicants ({applicants.length})</span>
                            </div>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Project members */}
                        
                        {isLoadingMembers ? (
                            <div className="flex items-center justify-center text-center py-12">
                                    <Spinner isLoading={true}/>
                                    <p className="text-gray-600 ml-4">Loading applications...</p>
                                </div>
                        ) : activeTab === 'members' && (
                            <div className="space-y-4">
                                {members.map((member) => (
                                    <ProjectMemberCard
                                        key={member.userId}
                                        member={member}
                                        refetchMembers={refetchMembers}
                                    />
                                ))}
                            </div>
                        )}

                        {activeTab === 'applicants' && (
                            // Applicants
                            <div className="space-y-4">
                                {isLoadingApplications ? (
                                    <div className="text-center py-12">
                                        <Spinner isLoading={true}/>
                                        <p className="text-gray-600">Loading applications...</p>
                                    </div>
                                ) : applicants.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FiUsers size={48} className="mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No pending applicants</h3>
                                        <p className="text-gray-600">All applications have been reviewed.</p>
                                    </div>
                                ) : (
                                    applicants.map((applicant) => (
                                        <ApplicationCard
                                            key={applicant.userId}
                                            image={
                                                <ProfileImage
                                                    profileImage={applicant.profileImage}
                                                    firstName={applicant.firstName}
                                                    lastName={applicant.lastName}
                                                />
                                            }
                                            header={`${applicant.firstName} ${applicant.lastName}`}
                                            subheader={applicant.email}
                                            skills={applicant.skills}
                                            coverMessage={applicant.message}
                                            dateApplied={formatDate(applicant.dateApplied)}
                                            actions={
                                                <div className="flex items-center space-x-2 ml-4 font-semibold justify-end">
                                                    <BGFadeButton
                                                        onClick={() => handleAcceptApplicant(applicant.userId)}
                                                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                                                        isLoading={acceptApplication.isPending}
                                                    >
                                                        Accept
                                                    </BGFadeButton>
                                                    <BGFadeButton
                                                        onClick={() => handleRejectApplicant(applicant.userId)}
                                                        className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                                                        isLoading={rejectApplication.isPending}
                                                    >
                                                        Reject
                                                    </BGFadeButton>
                                                </div>
                                            }
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectManagementDialog;
