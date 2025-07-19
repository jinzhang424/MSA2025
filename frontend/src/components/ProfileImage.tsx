interface ProfilePictureProps {
    profileImage?: string,
    firstName?: string,
    lastName?: string,
}

/**
 * 
 * @param profileImage - The image url of a user
 * @param firstName - The user's first name
 * @param lastName - The user's last name 
 * @returns A uesr's profile image fully rounded
 */
const ProfileImage = ({ profileImage = '', firstName = '', lastName = ''} : ProfilePictureProps) => {
    return (
        <div className="flex-shrink-0 w-10 h-10 bg-purple-950 rounded-full flex items-center justify-center overflow-hidden">
            {profileImage ? (
                <img src={profileImage} alt={`${firstName} ${lastName}`}/>
            ) : (
                <span className="text-white font-semibold text-sm">
                    {firstName[0]?.toUpperCase()}{lastName[0]?.toUpperCase()}
                </span>
            )}
        </div>
    )
}

export default ProfileImage
