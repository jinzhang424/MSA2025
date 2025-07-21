import { FiMail, FiStar, FiUser, FiUserCheck } from "react-icons/fi"
import { removeUserFromProject, type ProjectMemberData } from "../../api/Project"
import ProfileImage from "../ProfileImage"
import { formatDate } from "../../utils/formatTime"
import BGFadeButton from "../buttons/BGFadeButton"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import SkillTag from "../SkillTag"
import { useSelector } from "react-redux"
import type { RootState } from "../../store/store"

interface ProjectMemberCardProps {
    member: ProjectMemberData
    refetchMembers: () => {}
}

const ProjectMemberCard = ({ member, refetchMembers }: ProjectMemberCardProps ) => {
    const user = useSelector((state: RootState) => state.user);

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'Owner':
                return <FiStar className="text-yellow-500" size={16} />;
            case 'Lead':
                return <FiUserCheck className="text-blue-500" size={16} />;
            default:
                return <FiUser className="text-green-500" size={16} />;
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'Owner':
                return 'bg-yellow-100 text-yellow-800';
            case 'Lead':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-green-100 text-green-800';
        }
    };

    const removeMember = useMutation({
        mutationFn: ({ memberId, token }: { memberId: number; token: string }) => removeUserFromProject({
            userId: memberId, 
            projectId: member.projectId, 
            token: token
        }),
        onSuccess: () => {
            refetchMembers();
            toast.success("Successfully removed applicant");
        },
        onError: (e:any) => {
            toast.error(e.response?.data || "Unknown error occurred while removing member")
            console.error("Error while removing member", e);
        }
    })

    const handleRemoveMember = async (memberId: number) => {
        if (window.confirm('Are you sure you want to remove this member from the project?')) {
            removeMember.mutate({
                memberId: memberId, 
                token: user.token
            });
        }
    };

    return (
        <div key={member.userId} className="bg-white border border-gray-200 rounded-md p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <ProfileImage
                        profileImage={member.user.profileImage}
                        firstName={member.user.firstName}
                        lastName={member.user.lastName}
                    />
                    
                    {/* Member Info */}
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            {/* Nmae */}
                            <h3 className="font-semibold text-gray-900">
                                {member.user.firstName} {member.user.lastName}
                            </h3>

                            {/* Role */}
                            {getRoleIcon(member.role)}
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                            </span>
                        </div>

                        {/* Email */}
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                            <FiMail size={14} className="mr-1" />
                            {member.user.email}
                        </p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1 mt-2">
                            {member.user.skills.map((skill) => (
                                <SkillTag key={skill} label={skill}/>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Joined {formatDate(member.joinedAt)}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                {member.role !== 'Owner' && (
                    <div className="flex items-center space-x-2">
                        <BGFadeButton
                            onClick={() => handleRemoveMember(member.userId)}
                            className="text-sm text-white font-semibold bg-red-700 px-4 py-2 hover:bg-red-500 rounded-md transition-colors cursor-pointer"
                            isLoading={removeMember.isPending}
                        >
                            Remove
                        </BGFadeButton>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProjectMemberCard
