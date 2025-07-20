import type { ReactNode } from "react"
import { FiCheck, FiClock, FiX } from "react-icons/fi"
import SkillTag from "../SkillTag"

interface ApplicationCardProps {
    image: ReactNode
    firstName?: string
    lastName?: string
    header: string
    status?: string
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
        <div className="bg-white rounded-lg border border-gray-200 p-4">
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
                        {status && <div className={`flex items-center space-x-2 px-2 py-1 rounded-md ${getStatusColor(status)}`}>
                            {getStatusIcon(status)}
                            <span className='text-xs font-medium'>
                                {status}
                            </span>
                        </div>}
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
                            <SkillTag key={skill} label={skill}/>
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

export default ApplicationCard