import { useState } from 'react';
import { IoClose } from "react-icons/io5";
import ProjectCard from '../components/cards/ProjectCard';
import SimpleHero from '../components/SimpleHero';
import { BsFilterRight } from "react-icons/bs";
import Footer from '../components/Footer';
import { getProjectCardData } from '../api/Project';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { useQuery } from '@tanstack/react-query';
import StateDisplay from '../components/StateDisplay';

const CATEGORIES = ['All', 'Software Development', 'Web Design', 'Mobile App', 'Graphic Design', 'UI/UX', 'Data Science', 'Game Development'];

interface DiscoverProjectsProps {
    isDashboardView?: boolean
}

/**
 * The discover projects main section that displays project cards for users. Allows users to fiter based on categories
 * @param isDashboardView - A boolean value that adjusts the header based on whether want the dashboard view or normal view
 * @returns 
 */
const DiscoverProjects = ({isDashboardView = false}: DiscoverProjectsProps) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const user = useSelector((state: RootState) => state.user);

    /**
     * Fetches the projects.
     */
    const {isPending, isError, data, error} = useQuery({ 
        queryKey: ['projects', user.token], 
        queryFn: () => getProjectCardData(user.token)
    })

    if (isError) {
        console.error("Error while getting projects", error);
    }

    /**
     * Filters projects based on the user has search the category selected
     */
    const filteredProjects = data 
        ? data.filter(project => {
            const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
            const matchesSearch = project.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) 
                    || project.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) 
                    || project.skills.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        }) : []

    return ( 
        <div className={`${!isDashboardView && "p-12 sm:p-20"}`}>
            {isDashboardView ? (
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Discover Projects</h2>
                    <p className="text-gray-600 mt-1">Discover projects that interest you</p>
                </div>
            ) : (
                <h1 className='text-3xl font-bold text-navy'>Search For Projects</h1>
            )}

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
            <StateDisplay 
                isLoading={isPending} 
                isError={isError} 
                errorMsg='Error occurred while loading projects.'
                isEmpty={filteredProjects.length == 0}
                emptyMsg='No projects were found.'
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map(project => 
                        <ProjectCard key={project.projectId} {...project} />
                    )}
                </div>
            </StateDisplay>

            {/* Empty state */}
            {!isPending && filteredProjects.length === 0 && <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <h3 className="text-xl font-medium mb-2 text-navy">No projects found</h3>
                <p className="text-gray-500 mb-4">
                    Try adjusting your search or filter criteria to find more projects.
                </p>

                <button 
                    className="text-purple-950 hover:text-purple-700 font-semibold cursor-pointer" 
                    onClick={() => { 
                        setSearchQuery('');
                        setSelectedCategory('All');
                }}>
                    Clear all filters
                </button>
            </div>}
        </div>
    )
}

/**
 * 
 * @returns The project discovery page
 */
const ProjectDiscoveryPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <SimpleHero heading='Discover Projects' subheading='Find remote collaboration opportunities that match your skills and interests'/>

            <DiscoverProjects/>
            <Footer/>
        </div>
    )
};
export default ProjectDiscoveryPage;
export { DiscoverProjects }