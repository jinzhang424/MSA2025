import { useState, type ReactNode } from 'react';
import { FiClock, FiCheck, FiX, FiEye, FiUser } from 'react-icons/fi';
import { Link } from 'react-router';
import { type User } from '../../types/dashboard';
import { 
    GetOutgoingApplications, 
    GetIncomingApplications, 
    rejectUserApplication, 
    acceptUserApplication 
} from '../../api/ProjectApplication';
import SpinnerLoader from '../loaders/SpinnerLoader';
import { toast, ToastContainer } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import ProfileImage from '../ProfileImage';
import BGFadeButton from '../buttons/BGFadeButton';

interface ApplicationsProps {
    user: User;
}

const Applications = ({ user }: ApplicationsProps) => {
    const [activeTab, setActiveTab] = useState<'outgoing' | 'incoming'>('outgoing');

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
            acceptMutation.mutate({applicantId, projectId, token: user.token});
        } else {
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
            {isOutgoingLoading || isIncomingLoading ? (
                <SpinnerLoader className='flex mt-12 justify-center w-full'>
                    Loading applications...
                </SpinnerLoader>
            ) : (
                <>
                    {activeTab === 'outgoing' ? (
                        <div className="space-y-4">
                            {/* Outgoing applications results */}
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
                                // Outgoing appliations
                                outgoingApplications.map((application, i) => (
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
                                                className="flex items-center bg-purple-950 hover:bg-purple-800 font-semibold px-4 py-2 rounded-md text-gray-100"
                                            >
                                                <FiEye size={16} className="mr-2 mt-0.5" />
                                                View Project
                                            </Link>
                                        }
                                    />
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* No incoming applications */}
                            {incomingApplications.length === 0 ? (
                                <div className="text-center py-12">
                                    <FiUser size={48} className="mx-auto text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No applications received</h3>
                                    <p className="text-gray-600">No one has applied to your projects yet.</p>
                                </div>
                            ) : (
                                // Incoming applications
                                incomingApplications.map((application, i) => (
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
                                            <div className='flex space-x-3'>
                                                <BGFadeButton
                                                    onClick={() => handleApplicationAction(application.applicant.userId, application.projectId, 'reject')}
                                                    className="px-3 py-1 text-sm border-2 border-red-700 text-red-700 rounded hover:bg-red-700 hover:text-gray-50 transition-colors font-semibold"
                                                    isLoading={rejectMutation.isPending}
                                                >
                                                    Reject
                                                </BGFadeButton>
                                                <BGFadeButton
                                                    onClick={() => handleApplicationAction(application.applicant.userId, application.projectId, 'accept')}
                                                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-semibold"
                                                    isLoading={acceptMutation.isPending}
                                                >
                                                    Accept
                                                </BGFadeButton>
                                            </div>
                                        }
                                    />
                                ))
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

interface ApplicationCardProps {
    image: ReactNode
    firstName?: string
    lastName?: string
    header: string
    status: string
    subheader: string
    skills: string[]
    appliedTo?: string
    coverMessage: string
    dateApplied: string
    actions: ReactNode
}

/**
 * The card to display basic application information
 * 
 * @param image project or applicant profile image
 * @param header project title or applicant's full name
 * @param status application status
 * @param skills skills of the user
 * @param status application status
 * @param appliedTo who the user applied to (not used by outgoingApplications)
 * @param coverMessage applicant's cover message
 * @param dateApplied the date an applicant applied on YYYY-MM-DD
 * @param actions the actions a user could perform for this card (e.g. reject and accept applicant)
 * @returns the application card
 */
const ApplicationCard = ({
    image,
    header,
    subheader, 
    status,
    skills, 
    appliedTo, 
    coverMessage, 
    dateApplied, 
    actions,
} : ApplicationCardProps) => {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Pending':
                return <FiClock size={16} />;
            case 'Accepted':
                return <FiCheck size={16} />;
            case 'Rejected':
                return <FiX size={16} />;
            default:
                return <FiClock size={16} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Accepted':
                return 'bg-green-100 text-green-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (    
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start space-x-4">
                {image}

                {/* Applicantion details */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                        {/* Applicant info */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {header}
                            </h3>
                            <p className="text-sm text-gray-600">{subheader}</p>
                        </div>

                        {/* Application status */}
                        <div className={`flex items-center space-x-2 px-2 py-1 rounded-md ${getStatusColor(status)}`}>
                            {getStatusIcon(status)}
                            <span className='text-xs font-medium'>
                                {status}
                            </span>
                        </div>
                    </div>

                    {/* Applied to */}
                    {appliedTo && 
                        <p className="text-sm text-gray-600 mb-2">
                            Applied to: <span className="font-medium">{appliedTo}</span>
                        </p>
                    }

                    {/* Applicant skills */}
                    <div className="flex flex-wrap gap-1 mb-3">
                        {skills.map((skill) => (
                            <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                {skill}
                            </span>
                        ))}
                    </div>

                    {/* Applicant cover message */}
                    {coverMessage && (
                        <div>
                            <h1 className='text-sm font-semibold text-gray-900'>Cover Message:</h1>
                            <div className="bg-gray-100 rounded-md p-2 mb-3 mt-1">
                                <p className="text-sm text-gray-700">
                                    "{coverMessage}"
                                </p>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                        {/* Date applied */}
                        <span className="text-sm text-gray-500">
                            Applied {dateApplied}
                        </span>

                        {/* Application actions */}
                        {actions}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Applications;
