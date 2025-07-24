import { BsArrowLeft } from 'react-icons/bs';
import { useNavigate } from 'react-router'

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-purple-navy hover:text-purple-950 cursor-pointer">
            <BsArrowLeft className="group-hover:-translate-x-1 duration-300 h-4 w-4 mr-2" />
            Back
        </button>
    )
}

export default BackButton
