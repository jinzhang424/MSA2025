import axios from "axios"
import { toast } from "react-toastify";
import type { PasswordData, ProfileData } from "../components/dashboard/Settings"

export const updateProfile = async (profileData: ProfileData, token: string): Promise<Boolean> => {
    try {
        const res = await axios.patch("/api/User/UpdateProfile", {
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

        toast.success(res.data)
        return true;
    } catch (e: any) {
        console.error(e)
        toast.error(e.response?.data || "Unknown error occurred while updating profile.");
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
    } catch (e: any) {
        console.error(e);
        toast.error(e.response?.data || "Unknown error occurred while updating password");
        return false;
    }
}