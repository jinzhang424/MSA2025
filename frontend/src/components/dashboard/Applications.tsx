import { useState } from 'react';
import { FiEye } from 'react-icons/fi';
import { Link } from 'react-router';
import { type User } from '../../types/dashboard';
import { 
    GetOutgoingApplications, 
    GetIncomingApplications, 
    rejectUserApplication, 
    acceptUserApplication 
} from '../../api/ProjectApplication';
import { toast, ToastContainer } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import ProfileImage from '../ProfileImage';
import BGFadeButton from '../buttons/BGFadeButton';
import ApplicationCard from '../cards/ApplicationCard';
import StateDisplay from '../StateDisplay';

interface ApplicationsProps {
    user: User;
}

const Applications = ({ user }: ApplicationsProps) => {
    const [activeTab, setActiveTab] = useState<'outgoing' | 'incoming'>('outgoing');
    const [acceptingIds, setAcceptingIds] = useState({ applicantId: 0, projectId: 0});
    const [rejectIds, setRejectingIds] = useState({ applicantId: 0, projectId: 0 });

    // Getting outgoing applications
    const {
        data: outgoingApplications = [],
        isLoading: isOutgoingLoading,
        isError: isOutgoingError,
        error: outgoingError,
    } = useQuery({
        queryKey: ['outoingApplications', user.token],
        queryFn: () => GetOutgoingApplications(user.token),
        enabled: !!user.token
    })

    if (isOutgoingError) {
        toast.error(outgoingError.message)
        console.error("Error while fetching outgoing applications", outgoingError)
    }
    
    // Getting incoming applications
    const {
        data: incomingApplications = [],
        isLoading: isIncomingLoading,
        isError: isIncomingError,
        error: incomingError,
    } = useQuery({
        queryKey: ['outgoingApplications', user.token],
        queryFn: () => GetIncomingApplications(user.token),
        enabled: !!user.token
    })

    if (isIncomingError) {
        toast.error(incomingError.message)
        console.error("Error while fetching outgoing applications", outgoingError)
    }

    const acceptMutation = useMutation({
        mutationFn: acceptUserApplication,
        onSuccess: () => {
            toast.success("Successfully accepted applicant");
        },
        onError: (e: any) => {
            toast.error(e.response?.data || "Unknown error occurred while accepting applicant");
            console.error("Error while accepting applicant", e.message);
        }
    })

    const rejectMutation = useMutation({
        mutationFn: rejectUserApplication,
        onSuccess: () => {
            toast.success("Successfully rejected applicant");
        },
        onError: (e: any) => {
            toast.error(e.response?.data || "Unknown error occurred while rejecting applicant");
            console.error("Error while rejecting applicant", e.message);
        }
    })

    const handleApplicationAction = async (applicantId: number, projectId: number, action: 'accept' | 'reject') => {
        if (action == 'accept') {
            setAcceptingIds({ applicantId, projectId })
            acceptMutation.mutate({applicantId, projectId, token: user.token});
        } else {
            setRejectingIds({ applicantId, projectId })
            rejectMutation.mutate({applicantId, projectId, token: user.token});
        }
    };

    return (
        <div className="space-y-6">
            <ToastContainer/>
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
                        Incoming Applications ({incomingApplications.filter(app => app.status === 'Pending').length})
                    </button>
                </nav>
            </div>

            {/* Content */}
            {activeTab === 'outgoing' ? (
                <div className="space-y-4">
                    <StateDisplay
                        isLoading={isOutgoingLoading}
                        isError={isOutgoingError}
                        errorMsg='Error while getting your outgoing applications.'
                        isEmpty={outgoingApplications.length === 0}
                        emptyMsg='You have no outgoing applications yet.'
                    >
                        {outgoingApplications.map((application, i) => (
                            <ApplicationCard
                                key={i}
                                image={
                                    <img
                                        src={application.image || "project-img-replacement.png"}
                                        alt={application.title}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                }
                                header={application.title}
                                subheader={application.description}
                                status={application.status}
                                skills={application.skills}
                                coverMessage={application.coverMessage}
                                dateApplied={application.dateApplied}
                                actions={
                                    <Link
                                        to={`/project/${application.projectId}`}
                                        className="flex items-center bg-purple-950 hover:bg-purple-800 font-semibold px-4 py-2 rounded-md text-gray-100 justify-center w-fit self-end"
                                    >
                                        <FiEye size={16} className="mr-2 mt-0.5" />
                                        View Project
                                    </Link>
                                }
                            />
                        ))}
                    </StateDisplay>
                </div>
            ) : (
                <div className="space-y-4">
                    <StateDisplay
                        isLoading={isIncomingLoading}
                        isError={isIncomingError}
                        errorMsg='Error while getting your incoming applications.'
                        isEmpty={incomingApplications.length === 0}
                        emptyMsg='You have no incoming applications yet.'
                    >
                        {/* No incoming applications */}
                        {incomingApplications.map((application, i) => (
                            <ApplicationCard
                                key={i}
                                image={
                                    <ProfileImage 
                                        profileImage={application.applicant.profilePicture}
                                        firstName={application.applicant.firstName}
                                        lastName={application.applicant.lastName}
                                    />
                                }
                                firstName={application.applicant.firstName}
                                lastName={application.applicant.lastName}
                                header={`${application.applicant.firstName} ${application.applicant.lastName}`}
                                subheader={application.applicant.email}
                                status={application.status}
                                appliedTo={application.projectTitle}
                                skills={application.applicant.skills}
                                coverMessage={application.coverMessage}
                                dateApplied={application.dateApplied}
                                actions={
                                    <div className='flex lg:space-x-3 lg:justify-end justify-between lg:fit w-full'>
                                        <BGFadeButton
                                            onClick={() => handleApplicationAction(application.applicant.userId, application.projectId, 'accept')}
                                            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-semibold"
                                            isLoading={
                                                acceptMutation.isPending && 
                                                acceptingIds.applicantId === application.applicant.userId &&
                                                acceptingIds.projectId === application.projectId
                                            }
                                        >
                                            Accept
                                        </BGFadeButton>
                                        <BGFadeButton
                                            onClick={() => handleApplicationAction(application.applicant.userId, application.projectId, 'reject')}
                                            className="px-3 py-1 text-sm border-2 border-red-700 text-red-700 rounded hover:bg-red-700 hover:text-gray-50 transition-colors font-semibold"
                                            isLoading={
                                                rejectMutation.isPending &&
                                                rejectIds.applicantId === application.applicant.userId &&
                                                rejectIds.projectId === application.projectId
                                            }
                                        >
                                            Reject
                                        </BGFadeButton>
                                    </div>
                                }
                            />
                        ))}
                    </StateDisplay>
                </div>
            )}
        </div>
    );
};

export default Applications;
