import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface ApplicationFormData {
    coverMessage: string,
    availability: string,
}

/**
 * Sends an application to a project
 * @param application basic info the user wants to tell the project owner (see `ApplicationFormData` for full structure)
 * @param projectId project's id
 * @param token applicant's jwt
 * @returns axios response data
 */
export const sendApplication = async (application: ApplicationFormData, projectId: number, token: string) => {
    const res = await axios.post(`${API_BASE_URL}/api/ProjectApplication/ApplyForProject/${projectId}`, {
        CoverMessage: application.coverMessage,
        Availability: application.availability
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res.data
}

export interface RecentApplications {
    id: number,
    applicantName: string,
    projectImageUrl: string,
    projectName: string,
    time: string,
    status: string,
    skills: string[]
}

/**
 * Gets recent applications of a user
 * @param limit max size of returned list
 * @param token user's jwt
 * @returns a list of recent applications
 */
export const getRecentApplications = async (limit: number, token:string) : Promise<RecentApplications[]>  => {
    const res = await axios.get(`${API_BASE_URL}/api/ProjectApplication/GetRecentApplications/${limit}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data as RecentApplications[];
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

/**
 * Gets pending applications of a user
 * @param projectId project's id
 * @param token user's jwt
 * @returns a list of pending applications
 */
export const getProjectPendingApplications = async (projectId: number, token: string): Promise<ProjectApplication[]> => {
    const res = await axios.get(`${API_BASE_URL}/api/ProjectApplication/GetProjectPendingApplications/${projectId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res.data as ProjectApplication[];
};

interface ApplicationActionParams {
    applicantId: number, 
    projectId: number, 
    token: string
}

/**
 * Accepts a applicant's application to the user's project 
 * @param applicantId applicant's id
 * @param projectId project's id
 * @param token user's jwt
 * @returns axios response data
 */
export const acceptUserApplication = async ({applicantId, projectId, token} : ApplicationActionParams) => {
    const res = await axios.put(`${API_BASE_URL}/api/ProjectApplication/AcceptUserApplication/${applicantId}/${projectId}`, null, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};

/**
 * Rejects a applicant's application to the user's project 
 * @param applicantId applicant's id
 * @param projectId project's id
 * @param token user's jwt
 * @returns axios response data
 */
export const rejectUserApplication = async ({applicantId, projectId, token} : ApplicationActionParams) => {
    const res = await axios.patch(`${API_BASE_URL}/api/ProjectApplication/RejectUserApplication/${applicantId}/${projectId}`, null, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
};


export interface UserOutgoingApplication {
    projectId: number,
    title: string,
    description: string,
    image: string,
    dateApplied: string,
    skills: string[],
    status: string,
    coverMessage: string
}

/**
 * Gets applications that the user sent
 * @param token user's jwt
 * @returns a list of outgoing applications (see `UserOutgoingApplication` for full structure)
 */
export const GetOutgoingApplications = async (token: string): Promise<UserOutgoingApplication[]> => {
    const res = await axios.get(`${API_BASE_URL}/api/ProjectApplication/GetOutgoingApplications`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    return res.data as UserOutgoingApplication[];
};

export interface UserIncomingApplication {
    applicant: {
        userId: number,
        firstName: string,
        lastName: string,
        email: string,
        profilePicture: string | null,
        skills: string[]
    },
    projectId: number,
    projectTitle: string,
    status: string,
    dateApplied: string,
    coverMessage: string,
    availability: string
}

/**
 * Gets the applications made to the user's project(s)
 * @param token user's jwt
 * @returns a list of incoming applications (see `UserIncomingApplication` for full structure)
 */
export const GetIncomingApplications = async (token: string): Promise<UserIncomingApplication[]> => {
    const res = await axios.get(`${API_BASE_URL}/api/ProjectApplication/GetIncomingApplications`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data as UserIncomingApplication[];
};