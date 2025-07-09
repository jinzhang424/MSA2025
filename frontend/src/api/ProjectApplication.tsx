import axios from "axios";

export const getMostRecentProjectApplications = async (limit: number, token:string) => {
    const res = axios.get(`/api/GetMostRecentApplications/${limit}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    console.log(res);
    return res;
}