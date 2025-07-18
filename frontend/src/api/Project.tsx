import axios from "axios"
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface CreateProjectParams {
    title: string, 
    description: string,
    category: string,
    skills: string[],
    totalSpots: number,
    imageUrl?: string,
    duration: string;
}

export const createProject = async (projectData: CreateProjectParams, token: string): Promise<void> => {
    const res = await axios.post(`${API_BASE_URL}/api/Project/CreateProject`, {
        Title: projectData.title,
        Description: projectData.description,
        Skills: projectData.skills,
        Category: projectData.category,
        TotalSpots: projectData.totalSpots,
        Duration: projectData.duration,
        imageUrl: projectData.imageUrl
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data;
}

export interface ProjectPageProps {
    title: string,
    description: string,
    imageUrl: string,
    category: string,
    spotsTaken: number,
    totalSpots: number,
    skills: string[],
    teamLead: {
        firstName: string,
        lastName: string,
        image: string | undefined,
        role: string,

    },
    teamMembers: [{
        firstName: string,
        lastName: string,
        image: string | undefined,
        role: string
    }],
    duration: string,
}

export const getProject = async (projectId: string, token: string): Promise<ProjectPageProps> => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/Project/GetProjectPageData/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log("res: ", res)

        // Map backend response to ProjectPageProps
        const data = res.data as ProjectPageProps;
        console.log("Project page data: ", data)
        return data;
    } catch (e: any) {
        console.error(e);
        throw Error(e.response?.data)
    }
};

export interface ProjectCardProps {
    projectId: number,
    title: string,
    description: string,
    image: string | undefined,
    category: string,
    spotsTaken: number,
    totalSpots: number,
    duration: string,
    skills: string[]
}

export const getProjectCardData = async (token: string): Promise<ProjectCardProps[]> => {
    console.log(token);
    try {
        const res = await axios.get(`${API_BASE_URL}/api/Project/GetAllProjectsCardData`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = res.data;

        console.log("Project card data: ", data)
        return data as ProjectCardProps[];
    } catch (e: any) {
        console.error(e);
        toast.error(e.response?.data || "Unknown error occurred while loading projects.");
        return [];
    }
};

export interface UserProjectCardProps {
    projectId: number,
    title: string,
    description: string,
    image: string | undefined,
    category: string,
    spotsTaken: number,
    totalSpots: number,
    duration: string,
    skills: string[],
    status: 'All' | 'Active' | 'Completed' | 'cancelled'
}

export const getUserProjectCardData = async (token: string): Promise<UserProjectCardProps[]> => {
    const res = await axios.get(`${API_BASE_URL}/api/Project/GetAllUserProjects`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    return res.data;
};

export interface UserStats {
    myProjects: number,
    joinedProjects: number,
    pendingApplications: number,
    completedProjects: number
}

export const getUserStats = async (token: string): Promise<UserStats> => {
    const res = await axios.get(`${API_BASE_URL}/api/Project/GetUserStats`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res.data as UserStats;
};

export interface ProjectMemberData {
    projectId: number,
    userId: number,
    user: {
        id: number,
        firstName: string,
        lastName: string,
        email: string,
        bio: string,
        skills: string[],
    },
    role: string,
    joinedAt: string
}

export const getProjectMembers = async (projectId: number, token: string): Promise<ProjectMemberData[]> => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/Project/GetProjectMembers/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return res.data as ProjectMemberData[];
    } catch (e: any) {
        console.error(e);
        toast.error(e.response?.data || "Unknown error occurred while getting project members.");
        return [];
    }
}

interface ProjectActionParam {
    userId: number, 
    projectId: number, 
    token: string
}

export const removeUserFromProject = async ({userId, projectId, token} : ProjectActionParam) => {
    const res = await axios.delete(`${API_BASE_URL}/api/Project/RemoveUserFromProject/${userId}/${projectId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data
}

export interface JoinedProjectsCardData {
    projectId: number,
    title: string,
    description: string,
    image: string,
    category: string,
    spotsTaken: number,
    totalSpots: number,
    skills: string[],
    status: string,
    role: string,
}

export const getJoinedProjectsCardData = async (token: string) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/Project/GetJoinedProjects`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data as JoinedProjectsCardData[];
    } catch (e: any) {
        console.error(e);
        toast.error(e.response?.data || "Unknown error occurred while getting joined projects.");
        return [];
    }
}