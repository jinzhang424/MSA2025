import axios from "axios"
import type { PasswordData, ProfileData } from "../components/dashboard/Settings"

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Updates a user's profile
 * @param profileData (see `ProfileData` for full structure)
 * @param token user's jwt
 * @returns axios response data
 */
export const updateProfile = async (profileData: ProfileData, token: string) => {
    const res = await axios.patch(`${API_BASE_URL}/api/User/UpdateProfile`, {
        FirstName: profileData.firstName,
        LastName: profileData.lastName,
        Bio: profileData.bio,
        Email: profileData.email,
        Skills: profileData.skills,
        ProfileImage: ""
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return res.data;
}

/**
 * Updates a user's password
 * @param passwordData old and new password
 * @param token user's jwt
 * @returns axios response data
 */
export const updatePassword = async (passwordData: PasswordData, token: string) => {
    const res = await axios.patch(`${API_BASE_URL}/api/User/UpdatePassword`, {
        OldPassword: passwordData.oldPassword,
        NewPassword: passwordData.newPassword,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    
    return res.data;
}