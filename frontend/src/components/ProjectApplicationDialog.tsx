import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { useRef } from 'react';
import SuccessDialog from './SuccessDialog';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';
import { sendApplication } from '../api/ProjectApplication';
import { type ApplicationFormData } from '../api/ProjectApplication';
import { toast, ToastContainer } from 'react-toastify';
import SubmitButton from './buttons/SubmitButton';
import { useMutation } from '@tanstack/react-query';

interface ProjectApplicationDialogProps {
    projectId: number,
    projectTitle: string
}

const ProjectApplicationDialog = ({projectId, projectTitle} : ProjectApplicationDialogProps) => {
    const [open, setOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState<ApplicationFormData>({
        coverMessage: '',
        availability: ''
    });
    const dialogRef = useRef<HTMLDivElement>(null);
    const user = useSelector((state: RootState) => state.user)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const sendApplicationMutate = useMutation({
        mutationFn: () => sendApplication(formData, projectId, user.token),
        onError: (e) => {
            toast.error(e.message || "Unknown error occurred while sending application");
            console.error("Error while sending application", e);
        },
        onSuccess: () => {
            setSubmitted(true)
        }
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        sendApplicationMutate.mutate();
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
                <ToastContainer/>
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

                        <SubmitButton
                            isLoading={sendApplicationMutate.isPending}
                            className="mt-4 inline-flex items-center px-6 py-3 bg-purple-950 text-white rounded-md font-semibold hover:bg-purple-900 duration-200 disabled:opacity-50 w-full justify-center cursor-pointer"
                        >
                            <FiSend size={18} className="mr-2" />
                            Submit Application
                        </SubmitButton>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectApplicationDialog;
