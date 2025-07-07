import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { LuClock4 } from "react-icons/lu";
import { FiUsers, FiCalendar } from "react-icons/fi";
import { FaRegMessage } from "react-icons/fa6";
import { BsArrowLeft } from "react-icons/bs";
import ProjectApplicationDialog from '../components/ProjectApplicationDialog';

const SAMPLE_PROJECTS = [{
    id: '1',
    title: 'E-commerce Website Redesign',
    description: 'Looking for frontend developers and UI/UX designers to collaborate on redesigning an e-commerce platform with modern design principles and improved user experience.\n\nOur client is a mid-sized retailer looking to revamp their online presence with a focus on mobile responsiveness and improved conversion rates. The current website is outdated and not optimized for mobile devices, leading to high bounce rates and abandoned carts.\n\nWe need team members who can bring fresh ideas to improve the user journey from product discovery to checkout, implement modern design patterns, and ensure the site works flawlessly across all devices.',
    image: 'https://images.unsplash.com/photo-1661956602944-249bcd04b63f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    category: 'Web Design',
    availableSpots: 3,
    deadline: 'Oct 15, 2023',
    skills: ['React', 'UI/UX', 'Figma', 'JavaScript', 'Responsive Design'],
    teamLead: {
        name: 'Sarah Johnson',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        role: 'Project Manager'
    },
    teamMembers: [{
        name: 'Alex Chen',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        role: 'Backend Developer'
    }, {
        name: 'Maria Rodriguez',
        image: 'https://randomuser.me/api/portraits/women/68.jpg',
        role: 'UI/UX Designer'
    }],
    timeline: '2-3 months',
    commitment: '10-15 hours/week'
}, {
    id: '2',
    title: 'Mobile Fitness Tracking App',
    description: 'Developing a fitness tracking app that allows users to monitor workouts, set goals, and connect with friends. Need mobile developers and backend engineers.',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    category: 'Mobile App',
    availableSpots: 2,
    deadline: 'Nov 30, 2023',
    skills: ['Swift', 'Kotlin', 'Firebase', 'UX Design', 'API Development'],
    teamLead: {
        name: 'James Wilson',
        image: 'https://randomuser.me/api/portraits/men/52.jpg',
        role: 'Mobile Developer'
    },
    teamMembers: [{
        name: 'Emma Thompson',
        image: 'https://randomuser.me/api/portraits/women/22.jpg',
        role: 'UI Designer'
    }],
    timeline: '4 months',
    commitment: '15-20 hours/week'
}, {
    id: '3',
    title: 'Data Visualization Dashboard',
    description: 'Creating an interactive dashboard to visualize complex data sets for a research project. Looking for data scientists and frontend developers.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    category: 'Data Science',
    availableSpots: 4,
    deadline: 'Dec 10, 2023',
    skills: ['D3.js', 'React', 'Python', 'Data Analysis', 'SQL'],
    teamLead: {
        name: 'Michael Brown',
        image: 'https://randomuser.me/api/portraits/men/83.jpg',
        role: 'Data Scientist'
    },
    teamMembers: [],
    timeline: '3 months',
    commitment: '10 hours/week'
}, {
    id: '4',
    title: 'Brand Identity Design for Tech Startup',
    description: 'Seeking graphic designers to help create a comprehensive brand identity including logo, color palette, and brand guidelines for a new tech startup.',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=871&q=80',
    category: 'Graphic Design',
    availableSpots: 2,
    skills: ['Logo Design', 'Branding', 'Adobe Illustrator', 'Typography', 'Color Theory'],
    teamLead: {
        name: 'Olivia Davis',
        image: 'https://randomuser.me/api/portraits/women/33.jpg',
        role: 'Creative Director'
    },
    teamMembers: [{
        name: 'Liam Johnson',
        image: 'https://randomuser.me/api/portraits/men/91.jpg',
        role: 'Marketing Strategist'
    }],
    timeline: '1-2 months',
    commitment: '5-10 hours/week'
}, {
    id: '5',
    title: '2D Platformer Game Development',
    description: 'Building a fun 2D platformer game with unique mechanics. Need game designers, developers, and artists to join the team.',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    category: 'Game Development',
    availableSpots: 5,
    deadline: 'Jan 20, 2024',
    skills: ['Unity', 'C#', 'Game Design', '2D Art', 'Animation'],
    teamLead: {
        name: 'Noah Williams',
        image: 'https://randomuser.me/api/portraits/men/42.jpg',
        role: 'Game Developer'
    },
    teamMembers: [{
        name: 'Ava Miller',
        image: 'https://randomuser.me/api/portraits/women/17.jpg',
        role: 'Game Artist'
    }],
    timeline: '6 months',
    commitment: '15+ hours/week'
}, {
  id: '6',
  title: 'AI-Powered Chatbot for Customer Service',
  description: 'Developing a chatbot using natural language processing to improve customer service experiences. Looking for ML engineers and UX designers.',
  image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=806&q=80',
  category: 'Software Development',
  availableSpots: 3,
  deadline: 'Nov 15, 2023',
  skills: ['NLP', 'Python', 'Machine Learning', 'API Integration', 'UX Writing'],
  teamLead: {
    name: 'Ethan Taylor',
    image: 'https://randomuser.me/api/portraits/men/23.jpg',
    role: 'AI Engineer'
  },
  teamMembers: [{
    name: 'Sophia Anderson',
    image: 'https://randomuser.me/api/portraits/women/89.jpg',
    role: 'Product Manager'
  }, {
    name: 'Jackson Martinez',
    image: 'https://randomuser.me/api/portraits/men/55.jpg',
    role: 'Backend Developer'
  }],
  timeline: '3-4 months',
  commitment: '20 hours/week'
}];

const ProjectPage = () => {
    const {
        id
    } = useParams<{
        id: string;
    }>();
    const [project, setProject] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API call to fetch project details
        setTimeout(() => {
        const foundProject = SAMPLE_PROJECTS.find(p => p.id === id);
        setProject(foundProject);
        setIsLoading(false);
        }, 300);
    }, [id]);
    
    // Loading state
    if (isLoading) {
        return <div className="bg-gray-50 min-h-screen flex justify-center items-center">
            <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading project details...</p>
            </div>
        </div>;
    }

    // Project not found
    if (!project) {
        return (
            <div className="bg-gray-50 min-h-screen py-12 px-6">
                <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>

                <p className="text-gray-600 mb-6">
                    The project you're looking for doesn't exist or has been removed.
                </p>

                <Link to="/discover-projects" className="inline-flex items-center text-purple-navy hover:text-purple-950">
                    <BsArrowLeft className="group-hover:-translate-x-1 duration-300 h-4 w-4 mr-2" />
                    Back to projects
                </Link>
                </div>
            </div>
        )
    }

    // Project Detail
    return (
        <div className="relative bg-gray-50 min-h-screen py-8 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Breadcrumb */}
                <div className="mb-6">
                <Link to="/discover-projects" className="group inline-flex items-center text-gray-600 hover:text-navy">
                    <BsArrowLeft className="group-hover:-translate-x-1 duration-300 h-4 w-4 mr-2" />
                    Back to projects
                </Link>

                </div>
                {/* Project Header */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                    <div className="h-64 relative">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4 bg-navy/60 backdrop-blur-sm bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            {project.category}
                        </div>
                    </div>
                    
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                            <h1 className="text-3xl font-bold mb-4 md:mb-0">
                                {project.title}
                            </h1>
                        </div>

                        {/* Project Stats */}
                        <div className="flex flex-wrap gap-4 md:gap-8 mb-8 text-sm text-gray-600">
                            <div className="flex items-center">
                                <FiUsers className="h-5 w-5 mr-2 text-purple-600" />
                                <span>
                                {project.availableSpots} spot
                                {project.availableSpots !== 1 ? 's' : ''} available
                                </span>
                            </div>
                            {project.deadline && 
                                <div className="flex items-center">
                                    <FiCalendar className="h-5 w-5 mr-2 text-purple-600" />
                                    <span>Due {project.deadline}</span>
                                </div>
                            }
                            {project.timeline && 
                                <div className="flex items-center">
                                    <LuClock4 className="h-5 w-5 mr-2 text-purple-600" />
                                    <span>Duration: {project.timeline}</span>
                                </div>
                            }
                        </div>

                        {/* Project Description */}
                        <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">
                            Project Description
                        </h2>
                        <div className="text-gray-700 space-y-4">
                            {project.description.split('\n\n').map((paragraph: string, index: number) => <p key={index}>{paragraph}</p>)}
                        </div>
                        </div>

                        {/* Skills */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {project.skills.map((skill: string, index: number) => <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-md text-sm">
                                    {skill}
                                </span>)}
                            </div>
                        </div>

                        {/* Team */}
                        <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Team</h2>

                        {/* Team Lead */}
                        <div className="mb-4">
                            <div className="font-medium text-gray-500 mb-3">Team Lead</div>
                            <div className="flex items-center p-4 border border-gray-100 rounded-lg">
                            <img src={project.teamLead.image} alt={project.teamLead.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                            <div>
                                <div className="font-medium">{project.teamLead.name}</div>
                                <div className="text-sm text-gray-600">
                                {project.teamLead.role}
                                </div>
                            </div>
                            </div>
                        </div>
                        
                        {/* Team Members */}
                        {project.teamMembers.length > 0 && <div>
                            <div className="font-medium text-gray-500 mb-3">
                                Team Members
                            </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {project.teamMembers.map((member: any, index: number) => <div key={index} className="flex items-center p-4 border border-gray-100 rounded-lg">
                                        <img src={member.image} alt={member.name} className="w-10 h-10 rounded-full object-cover mr-4" />
                                        <div>
                                            <div className="font-medium">{member.name}</div>
                                            <div className="text-sm text-gray-600">
                                                {member.role}
                                            </div>
                                        </div>
                                    </div>)}
                                </div>
                            </div>}
                        </div>

                        {/* Call to Action */}
                        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row gap-4 justify-between items-center font-semibold">
                            <ProjectApplicationDialog/>
                            <button className="border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-100 flex items-center justify-center cursor-pointer w-54 duration-150">
                                <FaRegMessage className="h-5 w-5 mr-2" />
                                Contact Team Lead
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};
export default ProjectPage;