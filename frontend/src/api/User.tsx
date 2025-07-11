import axios from "axios"
import type { ProfileData } from "../components/dashboard/Settings"

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