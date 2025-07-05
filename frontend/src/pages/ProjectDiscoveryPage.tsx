import { useState } from 'react';
import { IoClose } from "react-icons/io5";
import ProjectCard from '../components/ProjectCard';
import SimpleHero from '../components/SimpleHero';
import { BsFilterRight } from "react-icons/bs";

const CATEGORIES = ['All', 'Software Development', 'Web Design', 'Mobile App', 'Graphic Design', 'UI/UX', 'Data Science', 'Game Development'];
const SAMPLE_PROJECTS = [{
  id: '1',
  title: 'E-commerce Website Redesign',
  description: 'Looking for frontend developers and UI/UX designers to collaborate on redesigning an e-commerce platform with modern design principles and improved user experience.',
  image: 'https://images.unsplash.com/photo-1661956602944-249bcd04b63f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
  category: 'Web Design',
  availableSpots: 3,
  deadline: 'Oct 15, 2023',
  skills: ['React', 'UI/UX', 'Figma', 'JavaScript', 'Responsive Design']
}, {
  id: '2',
  title: 'Mobile Fitness Tracking App',
  description: 'Developing a fitness tracking app that allows users to monitor workouts, set goals, and connect with friends. Need mobile developers and backend engineers.',
  image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
  category: 'Mobile App',
  availableSpots: 2,
  deadline: 'Nov 30, 2023',
  skills: ['Swift', 'Kotlin', 'Firebase', 'UX Design', 'API Development']
}, {
  id: '3',
  title: 'Data Visualization Dashboard',
  description: 'Creating an interactive dashboard to visualize complex data sets for a research project. Looking for data scientists and frontend developers.',
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
  category: 'Data Science',
  availableSpots: 4,
  deadline: 'Dec 10, 2023',
  skills: ['D3.js', 'React', 'Python', 'Data Analysis', 'SQL']
}, {
  id: '4',
  title: 'Brand Identity Design for Tech Startup',
  description: 'Seeking graphic designers to help create a comprehensive brand identity including logo, color palette, and brand guidelines for a new tech startup.',
  image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=871&q=80',
  category: 'Graphic Design',
  availableSpots: 2,
  skills: ['Logo Design', 'Branding', 'Adobe Illustrator', 'Typography', 'Color Theory']
}, {
  id: '5',
  title: '2D Platformer Game Development',
  description: 'Building a fun 2D platformer game with unique mechanics. Need game designers, developers, and artists to join the team.',
  image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
  category: 'Game Development',
  availableSpots: 5,
  deadline: 'Jan 20, 2024',
  skills: ['Unity', 'C#', 'Game Design', '2D Art', 'Animation']
}, {
  id: '6',
  title: 'AI-Powered Chatbot for Customer Service',
  description: 'Developing a chatbot using natural language processing to improve customer service experiences. Looking for ML engineers and UX designers.',
  image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=806&q=80',
  category: 'Software Development',
  availableSpots: 3,
  deadline: 'Nov 15, 2023',
  skills: ['NLP', 'Python', 'Machine Learning', 'API Integration', 'UX Writing']
}];

const ProjectDiscoveryPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const filteredProjects = SAMPLE_PROJECTS.filter(project => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || project.description.toLowerCase().includes(searchQuery.toLowerCase()) || project.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())); return matchesCategory && matchesSearch;});

    return (
        <div className="bg-gray-50 min-h-screen">
            <SimpleHero heading='Discover Projects' subheading='Find remote collaboration opportunities that match your skills and interests'/>

            <div className="p-24">
                <h1 className='text-3xl font-bold text-navy'>Search For Projects</h1>

                <div className="bg-white p-4 rounded-lg shadow-sm mb-8 mt-8">
                    {/* Search and Filter Bar */}
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search bar */}
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <IoClose className="h-5 w-5 text-gray-400" />
                            </div>

                            <input 
                                type="text" 
                                placeholder="Search projects, skills, or keywords..." 
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent" 
                                value={searchQuery} 
                                onChange={e => setSearchQuery(e.target.value)} 
                            />
                        </div>

                        {/* Filter button */}
                        <button className="md:w-auto w-full flex items-center justify-center gap-2 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer" onClick={() => setShowFilters(!showFilters)}>
                            <BsFilterRight/>
                            Filters
                        </button>
                    </div>

                    {/* Filter */}
                    {showFilters && 
                        <div className="mt-4 pt-4 border-t-2 border-black/10">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium">Categories</h3>
                                <button className="text-sm text-gray-500 hover:text-black" onClick={() => setSelectedCategory('All')}>
                                    Clear
                                </button>
                            </div>

                            {/* Filter options */}
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(category => 
                                    <button 
                                        key={category} 
                                        className={`p-1 pl-3 pr-3 rounded-sm text-sm cursor-pointer ${selectedCategory === category ? 'bg-purple-950/90 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} 
                                        onClick={() => setSelectedCategory(category)}
                                    >
                                        {category}
                                    </button>
                                )}
                            </div>
                        </div>
                    }
                </div>

                {/* Results count */}
                <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600 font-semibold">
                    {filteredProjects.length}{' '}
                    {filteredProjects.length === 1 ? 'project' : 'projects'} found
                </p>
                
                </div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map(project => 
                        <ProjectCard key={project.id} {...project} />
                    )}
                </div>

                {/* Empty state */}
                {filteredProjects.length === 0 && <div className="text-center py-16">
                    <div className="text-gray-400 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    <h3 className="text-xl font-medium mb-2">No projects found</h3>
                    <p className="text-gray-500 mb-4">
                        Try adjusting your search or filter criteria to find more projects.
                    </p>

                    <button 
                        className="text-purple-600 hover:text-purple-800" 
                        onClick={() => { 
                            setSearchQuery('');
                            setSelectedCategory('All');
                    }}>
                        Clear all filters
                    </button>
                </div>}
            </div>
        </div>
    )
};
export default ProjectDiscoveryPage;