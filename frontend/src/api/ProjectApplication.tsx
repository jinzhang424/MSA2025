import axios from "axios";

export interface RecentApplications {
    id: 0,
    applicantName: string,
    applicantImageUrl: string,
    projectName: string,
    time: string,
    status: string,
    skills: string[]
}

export const getRecentApplications = async (limit: number, token:string) => {
    const res = axios.get(`/api/getRecentApplications/${limit}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    console.log(res);
    return res;
}