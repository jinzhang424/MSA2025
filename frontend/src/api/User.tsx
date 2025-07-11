import axios from "axios"
import type { PasswordData, ProfileData } from "../components/dashboard/Settings"

export const updateProfile = async (profileData: ProfileData, token: string): Promise<Boolean> => {
    try {
        await axios.patch("/api/User/UpdateProfile", {
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
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export const updatePassword = async (passwordData: PasswordData, token: string) : Promise<Boolean> => {
    try {
        await axios.patch("/api/User/UpdatePassword", {
            OldPassword: passwordData.oldPassword,
            NewPassword: passwordData.newPassword,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}