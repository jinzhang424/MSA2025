import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { useRef } from 'react';
import SuccessDialog from './SuccessDialog';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';
import { sendApplication } from '../api/ProjectApplication';
import { type ApplicationFormData } from '../api/ProjectApplication';

interface ProjectApplicationDialogProps {
    projectId: number,
    projectTitle: string
}

const ProjectApplicationDialog = ({projectId, projectTitle} : ProjectApplicationDialogProps) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<ApplicationFormData>({
        coverMessage: '',
        availability: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);
    const user = useSelector((state: RootState) => state.user)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            console.log('Application submitted:', {
                projectId: projectId,
                ...formData
            });

            await sendApplication(formData, projectId, user.token);
            setSubmitted(true);
        } catch (error) {
            alert("Error occurred while sending application");
            console.error('Error submitting application:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openDialog = () => {
        setOpen(true);
        if (dialogRef.current) {
            setTimeout(() => {
                dialogRef.current?.scrollIntoView({ behavior: "smooth", block:"start"})
            }, 10)
        }
    }

    const closeDialog = () => {
        setOpen(false);
        setSubmitted(false);
    }

    return (
        <div>
            <button className="bg-purple-950 text-white px-6 py-3 rounded-md hover:bg-purple-900 flex items-center justify-center cursor-pointer w-54 duration-150" onClick={() => openDialog()}>
                Apply to Join
            </button>

            <div ref={dialogRef} className={`absolute flex justify-center inset-0 top-0 mx-auto w-full ${!open && 'opacity-0 pointer-events-none'} duration-300`}>
                {/* Black Tint */}
                <div className='absolute inset-0 bg-black/60' onClick={() => closeDialog()}/>
                
                <SuccessDialog projectTitle={projectTitle} submitted={submitted}/>

                {/* Application */}
                <div className={`relative mt-16 sm:mx-12 mx-6 bg-white rounded-lg p-12 w-full max-w-[600px] h-fit ${(!open || submitted) && 'scale-50 duration-300 opacity-0'}`}>

                    <h2 className="text-3xl font-bold text-gray-900 w-full text-center py-6">Submit Your Application</h2>
                    
                    <form onSubmit={handleSubmit} className="mt-10 space-y-4">
                        {/* Cover Message */}
                        <div>
                            <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                Cover Message *
                            </label>
                            <textarea
                                id="coverMessage"
                                name="coverMessage"
                                required
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent transition-all duration-200 text-gray-950"
                                placeholder="Introduce yourself and explain why you're interested in this project..."
                                value={formData.coverMessage}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Availability */}
                        <div>
                            <label htmlFor="availability" className="block text-sm font-semibold text-gray-700 mb-2">
                                Availability *
                            </label>
                            <input
                                type="text"
                                id="availability"
                                name="availability"
                                required
                                className="w-full px-4 py-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-950 focus:border-transparent transition-all duration-200 text-gray-950"
                                placeholder="e.g., 20 hours/week, weekends only, full-time..."
                                value={formData.availability}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-4 inline-flex items-center px-6 py-3 bg-purple-950 text-white rounded-md font-semibold hover:bg-purple-900 duration-200 disabled:opacity-50 w-full justify-center cursor-pointer"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                    </svg>
                                    Submitting Application...
                                </span>
                            ) : (
                                <>
                                    <FiSend size={18} className="mr-2" />
                                    Submit Application
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectApplicationDialog;
