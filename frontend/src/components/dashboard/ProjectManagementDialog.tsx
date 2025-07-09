import { useState, useEffect } from 'react';
import { FiX, FiUsers, FiUserCheck, FiMail, FiUser, FiStar } from 'react-icons/fi';
import { type UserProjectCardProps } from '../../api/Project';
import { getProjectMembers, type ProjectMemberData } from '../../api/Project';
import { getProjectApplications, type ProjectApplication } from '../../api/ProjectApplication';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

interface ProjectManagementDialogProps {
    project: UserProjectCardProps;
    isOpen: boolean;
    onClose: () => void;
}

const ProjectManagementDialog = ({ project, isOpen, onClose }: ProjectManagementDialogProps) => {
    const [activeTab, setActiveTab] = useState<'members' | 'applicants'>('members');
    const [members, setMembers] = useState<ProjectMemberData[]>([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [applicants, setApplicants] = useState<ProjectApplication[]>([]);
    const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);

    const user = useSelector((state: RootState) => state.user);

    console.log(project)

    useEffect(() => {
        const fetchMembers = async () => {
            if (isOpen) {
                setIsLoadingMembers(true);
                const data = await getProjectMembers(project.projectId, user.token);
                setMembers(data);
                setIsLoadingMembers(false);
            }
        };
        fetchMembers();
    }, [isOpen, project.projectId]);

    useEffect(() => {
        const fetchApplicants = async () => {
            if (isOpen) {
                setIsLoadingApplicants(true);
                const data = await getProjectApplications(project.projectId, user.token);
                setApplicants(data);
                setIsLoadingApplicants(false);
            }
        };
        fetchApplicants();
    }, [isOpen, project.projectId]);

    const handleAcceptApplicant = (applicantId: number) => {
        console.log('Accept applicant:', applicantId);
        // TODO: Implement accept logic
    };

    const handleRejectApplicant = (applicantId: number) => {
        console.log('Reject applicant:', applicantId);
        // TODO: Implement reject logic
    };

    const handleRemoveMember = (memberId: number) => {
        if (window.confirm('Are you sure you want to remove this member from the project?')) {
            console.log('Remove member:', memberId);
            // TODO: Implement remove logic
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'creator':
                return <FiStar className="text-yellow-500" size={16} />;
            case 'lead':
                return <FiUserCheck className="text-blue-500" size={16} />;
            default:
                return <FiUser className="text-gray-500" size={16} />;
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'creator':
                return 'bg-yellow-100 text-yellow-800';
            case 'lead':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (!isOpen) return null;

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
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
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
                                className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{project.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <FiUsers size={14} className="mr-1" />
                                        {project.totalSpots - project.spotsAvailable}/{project.totalSpots} members
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
                                <span>Applicants ({applicants.filter(a => a.status === 'pending').length})</span>
                            </div>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeTab === 'members' && (
                            <div className="space-y-4">
                                {members.map((member) => (
                                    <div key={member.userId} className="bg-white border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                {/* Avatar */}
                                                <div className="w-12 h-12 bg-purple-950 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-semibold text-sm">
                                                        {member.user.firstName[0]}{member.user.lastName[0]}
                                                    </span>
                                                </div>
                                                
                                                {/* Member Info */}
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2">
                                                        <h3 className="font-semibold text-gray-900">
                                                            {member.user.firstName} {member.user.lastName}
                                                        </h3>
                                                        {getRoleIcon(member.role)}
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                                                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 flex items-center mt-1">
                                                        <FiMail size={14} className="mr-1" />
                                                        {member.user.email}
                                                    </p>
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {member.user.skills.map((skill) => (
                                                            <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        Joined {formatDate(member.joinedAt)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            {member.role !== 'creator' && (
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleRemoveMember(member.userId)}
                                                        className="text-sm text-gray-100 font-semibold bg-red-600 px-4 py-2 hover:bg-red-500 rounded-md transition-colors cursor-pointer"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'applicants' && (
                            <div className="space-y-4">
                                {applicants.filter(a => a.status === 'pending').length === 0 ? (
                                    <div className="text-center py-12">
                                        <FiUsers size={48} className="mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No pending applicants</h3>
                                        <p className="text-gray-600">All applications have been reviewed.</p>
                                    </div>
                                ) : (
                                    applicants.filter(a => a.status === 'pending').map((applicant) => (
                                        <div key={applicant.userId} className="bg-white border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-4 flex-1">
                                                    {/* Avatar */}
                                                    <div className="w-12 h-12 bg-purple-950 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-semibold text-sm">
                                                            {applicant.firstName[0]}{applicant.lastName[0]}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Applicant Info */}
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900">
                                                            {applicant.firstName} {applicant.lastName}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 flex items-center mt-1">
                                                            <FiMail size={14} className="mr-1" />
                                                            {applicant.email}
                                                        </p>
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {applicant.skills.map((skill) => (
                                                                <span key={skill} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        {applicant.message && (
                                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                                <p className="text-sm text-gray-700">{applicant.message}</p>
                                                            </div>
                                                        )}
                                                        <p className="text-xs text-gray-500 mt-2">
                                                            Applied {formatDate(applicant.dateApplied)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center space-x-2 ml-4 font-semibold">
                                                    <button
                                                        onClick={() => handleAcceptApplicant(applicant.userId)}
                                                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectApplicant(applicant.userId)}
                                                        className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
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
