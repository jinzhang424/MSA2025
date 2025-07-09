import axios from "axios";

export interface RecentApplications {
    id: number,
    applicantName: string,
    applicantImageUrl: string,
    projectName: string,
    time: string,
    status: string,
    skills: string[]
}

export const getRecentApplications = async (limit: number, token:string) : Promise<RecentApplications[]>  => {
    try {
        const res = await axios.get(`/api/ProjectApplication/GetRecentApplications/${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        console.log(res);
        return res.data as RecentApplications[];
    } catch (e) {
        return [];
    }
}