import axios from "axios"

export interface ProjectCreationProps {
    title: string, 
    description: string,
    skills: [],
    totalSpots: number,
    imageUrl?: string,
}

export const createProject = async (projectData: ProjectCreationProps, token: string): Promise<boolean> => {
    try {
        await axios.post("/api/Project/CreateProject", {
            Title: projectData.title,
            Description: projectData.description,
            Skills: projectData.skills,
            TotalSpots: projectData.totalSpots,
            imageUrl: projectData.imageUrl
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return true;
    } catch (e) {
        console.log(e)
        return false;
    }
}