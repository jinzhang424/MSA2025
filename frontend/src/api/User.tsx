import axios from "axios"
import type { PasswordData, ProfileData } from "../components/dashboard/Settings"

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

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

    return res;
}

export const updatePassword = async (passwordData: PasswordData, token: string) => {
    const res = await axios.patch(`${API_BASE_URL}/api/User/UpdatePassword`, {
        OldPassword: passwordData.oldPassword,
        NewPassword: passwordData.newPassword,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return res;
}