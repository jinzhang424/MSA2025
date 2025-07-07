interface SuccessDialogProps {
    projectTitle: string
    submitted: boolean
}

const SuccessDialog = ({projectTitle, submitted} : SuccessDialogProps) => {
  return (
    <div className={`absolute mt-32 mx-8 max-w-md ${!submitted && 'opacity-0 scale-50 pointer-events-none'} duration-200`}>
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">
                Your application for "{projectTitle}" has been sent successfully. 
                The project creator will review it and get back to you soon.
            </p>
        </div>
    </div>
  )
}

export default SuccessDialog
