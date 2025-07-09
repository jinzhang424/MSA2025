import axios from "axios"

export interface ProjectCreationProps {
    title: string, 
    description: string,
    category: string,
    skills: string[],
    totalSpots: number,
    imageUrl?: string,
    duration: string;
}

export const createProject = async (projectData: ProjectCreationProps, token: string): Promise<void> => {
    try {
        await axios.post("/api/Project/CreateProject", {
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
    } catch (e) {
        console.log(e)
        throw Error("Error occurred while creating project");
    }
}

export interface ProjectPageProps {
    title: string,
    description: string,
    image: string,
    category: string,
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
        const res = await axios.get(`/api/Project/GetProjectPageData/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log("res: ", res)

        // Map backend response to ProjectPageProps
        const data = res.data;
        const project: ProjectPageProps = {
            title: data.title,
            description: data.description,
            image: data.imageUrl || '',
            category: data.category,
            totalSpots: data.totalSpots,
            skills: data.skills || [],
            teamLead: {
                firstName: data.teamLead?.firstName || '',
                lastName: data.teamLead?.lastName,
                image: data.teamLead?.image || undefined,
                role: data.teamLead?.role || ''
            },
            teamMembers: data.teamMembers || [],
            duration: data.duration || ''
        };
        console.log("Project page data: ", project)
        return project;
    } catch (e) {
        console.error(e);
        throw Error("Error while getting project.");
    }
};

export interface ProjectCardProps {
    projectId: number,
    title: string,
    description: string,
    image: string | undefined,
    category: string,
    availableSpots: number,
    duration: string,
    skills: string[]
}

export const getProjectCardData = async (): Promise<ProjectCardProps[]> => {
    try {
        const res = await axios.get('/api/Project/GetAllProjectsCardData');
        const data = res.data;

        console.log("Project card data: ", data)
        // Map backend projects to ProjectCardProps[]
        return data as ProjectCardProps[];
    } catch (e) {
        console.error(e);
        return [];
    }
};

export interface UserStats {
    myProjects: number,
    joinedProjects: number,
    pendingApplications: number,
    completedProjects: number
}

export const getUserStats = async (token: string): Promise<UserStats> => {
    try {
        const res = await axios.get('/api/Project/GetUserStats', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log("User stats data", res)
        return res.data as UserStats;
    } catch (e) {
        console.error(e);
        // Return -1 if error
        return {
            myProjects: -1,
            joinedProjects: -1,
            pendingApplications: -1,
            completedProjects: -1
        };
    }
};