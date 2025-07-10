import axios from "axios";

export interface ApplicationFormData {
    coverMessage: string,
    availability: string,
}

export const sendApplication = async (application: ApplicationFormData, projectId: number, token: string) => {
    try {
        const res = await axios.post(`/api/ProjectApplication/ApplyForProject/${projectId}`, {
            CoverMessage: application.coverMessage,
            Availability: application.availability
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (e) {
        throw Error("Failed to send project application");
    }
}

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

export interface ProjectApplication {
    userId: number,
    firstName: string,
    lastName: string,
    email: string,
    skills: string[],
    dateApplied: string,
    message: string,
    status: string
}

export const getProjectPendingApplications = async (projectId: number, token: string): Promise<ProjectApplication[]> => {
    try {
        const res = await axios.get(`/api/ProjectApplication/GetProjectPendingApplications/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log("Get Project Applications data:", res);
        return res.data as ProjectApplication[];
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const acceptUserApplication = async (userId: number, projectId: number, token: string): Promise<boolean> => {
    try {
        const res = await axios.put(`/api/ProjectApplication/AcceptUserApplication/${userId}/${projectId}`, null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.status === 200;
    } catch (e) {
        console.error(e);
        return false;
    }
};

export const rejectUserApplication = async (victimId: number, projectId: number, token: string): Promise<boolean> => {
    try {
        const res = await axios.delete(`/api/ProjectApplication/RejectUserApplication/${victimId}/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.status === 200;
    } catch (e) {
        console.error(e);
        return false;
    }
};