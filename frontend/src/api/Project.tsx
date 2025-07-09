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

export const createProject = async (projectData: ProjectCreationProps, token: string): Promise<Error | void> => {
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
        return Error("Error occurred while creating project");
    }
}