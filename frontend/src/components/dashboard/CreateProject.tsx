import React, { useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { IoChevronDown } from 'react-icons/io5';
import { createProject } from '../../api/Project';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store/store';
import { type CreateProjectParams } from '../../api/Project';
import SubmitButton from '../buttons/SubmitButton';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

/**
 * Allows user to create projects
 * 
 * @returns the create project
 */
const CreateProject = () => {
    const [formData, setFormData] = useState<CreateProjectParams>({
        title: '',
        description: '',
        category: '',
        imageUrl: '',
        totalSpots: 1,
        skills: [] as string[],
        duration: '' // Add duration to form state
    });

  const [skillInput, setSkillInput] = useState('');
  const user = useSelector((state: RootState) => state.user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
        name,
        value
    } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
  };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {
            name,
            value
        } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: parseInt(value) || 0
        }));
    };

    const addSkill = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, skillInput.trim()]
            }));
            
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

    const submit = useMutation({
        mutationFn: (formData: CreateProjectParams) => createProject(formData, user.token),
        onSuccess: () => {
            toast.success("Sucessfully created project")
        },
        onError: (e:any) => {
            toast.error(e.response?.data || "Unknown error occurred while creating project")
        }
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        submit.mutate(formData);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <ToastContainer/>
            <div>
                <h2 className="text-xl font-semibold text-gray-900">My Projects</h2>
                <p className="text-gray-600 mt-1">Projects you've created and are managing</p>
            </div>

            {/* Create Project */}
            <div className="bg-white rounded-lg border-gray-200 p-6 mt-8">

                <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6 sm:p-3">
                        {/* Project Title */}
                        <div>
                            <label htmlFor="title" className="block text-md font-semibold text-slate-700 mb-1">
                                Project Title*
                            </label>

                            <input 
                                type="text" 
                                id="title" 
                                name="title" 
                                required 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent" 
                                placeholder="Give your project a clear and descriptive title" 
                                value={formData.title} 
                                onChange={handleChange} />
                        </div>

                        {/* Project Description */}
                        <div>
                            <label htmlFor="description" className="block text-md font-semibold text-gray-700 mb-1">
                                Project Description*
                            </label>

                            <textarea 
                                id="description" 
                                name="description" 
                                required 
                                rows={5}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent text-gray-600" 
                                placeholder="Describe your project, goals, and what kind of team members you're looking for" 
                                value={formData.description} 
                                onChange={handleChange} 
                            />
                        </div>

                        {/* Category and Image URL */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="category" className="block text-md font-semibold text-gray-700 mb-1">
                                    Category*
                                </label>
                                
                                <div className='relative'>
                                    <select 
                                        id="category" 
                                        name="category" 
                                        required 
                                        className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent" 
                                        value={formData.category} 
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>
                                            Select a category
                                        </option>
                                        <option value="Software Development">
                                            Software Development
                                        </option>
                                        <option value="Web Design">Web Design</option>
                                        <option value="Mobile App">Mobile App</option>
                                        <option value="Graphic Design">Graphic Design</option>
                                        <option value="UI/UX">UI/UX</option>
                                        <option value="Data Science">Data Science</option>
                                        <option value="Game Development">Game Development</option>
                                    </select>
                                    <IoChevronDown className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-800" size={20}/>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="imageUrl" className="block text-md font-semiboldtext-md font-semibold text-gray-700 mb-1">
                                    Cover Image URL
                                </label>
                                <input type="url" id="imageUrl" name="imageUrl" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent" placeholder="https://example.com/image.jpg" value={formData.imageUrl} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Deadline and Available Spots */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="availableSpots" className="block text-md font-semibold text-gray-700 mb-1">
                                    Available Spots*
                                </label>

                                <input 
                                    type="number" 
                                    id="totalSpots" 
                                    name="totalSpots" 
                                    min="1" 
                                    max="20" 
                                    required 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent" 
                                    value={formData.totalSpots} 
                                    onChange={handleNumberChange} 
                                />
                            </div>

                            <div>
                                <label htmlFor="duration" className="block text-md font-semibold text-gray-700 mb-1">
                                    Duration*
                                </label>
                                <input
                                    type="text"
                                    id="duration"
                                    name="duration"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent"
                                    placeholder="e.g. 1 - 2 months, 8 weeks, etc."
                                    value={formData.duration}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Required Skills */}
                        <div>
                            <label htmlFor="skills" className="block text-md font-semibold text-gray-700 mb-1">
                                Required Skills
                            </label>

                            <div className="flex">
                                <input 
                                    type="text" 
                                    id="skills" 
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent" 
                                    placeholder="Add skills needed (e.g., React, Figma, Python)" 
                                    value={skillInput} 
                                    onChange={e => setSkillInput(e.target.value)} 
                                    onKeyDown={handleSkillInputKeyDown} 
                                />

                                <button 
                                    type="button" 
                                    className="bg-purple-950 hover:purple-800 duration-200 text-white px-3 py-2 rounded-r-md hover:bg-purple-950" 
                                    onClick={addSkill}
                                >
                                    <FaPlus className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Skills Tags */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.skills.map((skill, index) => 
                                    <div key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-md flex items-center">
                                        <span>{skill}</span>

                                        <button 
                                            type="button" 
                                            className="ml-2 text-purple-800 hover:text-purple-900 cursor-pointer" 
                                            onClick={() => removeSkill(skill)}
                                        >
                                            <IoClose className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <SubmitButton className="w-full duration-200 bg-purple-950 text-white py-3 px-6 rounded-md hover:bg-purple-800 mt-4" isLoading={submit.isPending}>
                                Create Project
                            </SubmitButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};
export default CreateProject;