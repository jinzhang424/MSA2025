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

/**
 * Sends a request to create a project
 * 
 * @param projectData The project details (see `CreateProjectParams` for full structure).
 * @param token - user's jwt
 * @returns - A response data
 */
export const createProject = async (projectData: CreateProjectParams, token: string) => {
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

/**
 * Get's a projects info
 * @param projectId project's id
 * @param token user's jwt
 * @returns data of the including basic info, teamLead and teamMembers project (see `ProjectPageProps` for full structure)
 */
export const getProject = async (projectId: string, token: string): Promise<ProjectPageProps> => {
    const res = await axios.get(`${API_BASE_URL}/api/Project/GetProjectPageData/${projectId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res.data as ProjectPageProps;
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

/**
 * Get's only the necessary data for a project card
 * @param token user's jwt
 * @returns A list of project card data (see `ProjectCardProps` for full structure)
 */
export const getProjectCardData = async (token: string): Promise<ProjectCardProps[]> => {
    const res = await axios.get(`${API_BASE_URL}/api/Project/GetAllProjectsCardData`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    
    return res.data as ProjectCardProps[];
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

/**
 * Get's the project card data for projects that the user created
 * @param token user's jwt
 * @returns An array of project card data
 */
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

/**
 * Get's a user's stats
 * @param token user's jwt
 * @returns User stats (see `UserStats` for full structure)
 */
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

/**
 * Gets the members of a project
 * @param projectId a project's id
 * @param token user's jwt
 * @returns a list of project member data
 */
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

/**
 * Removes a user from the project
 * @param userId user's id
 * @param projectId project's id
 * @param token user's token 
 * @returns axios response data
 */
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

/**
 * Gets card data for projects that the user has joined
 * @param token user's token
 * @returns a list of card data for projects
 */
export const getJoinedProjectsCardData = async (token: string) => {
    const res = await axios.get(`${API_BASE_URL}/api/Project/GetJoinedProjects`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data as JoinedProjectsCardData[];
}