import { type ReactNode } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from 'react-router';

interface BackButtonProps {
    children?: ReactNode,
    className?: string,
    to: string
}

function BackLink({ children, className, to }: BackButtonProps) {
    return (
        <Link 
            className={`absolute top-6 left-10 group flex gap-2 items-center text-white/80 hover:text-white duration-200 text-md ` + className} 
            to={to}
        >
            <IoIosArrowRoundBack className="group-hover:-translate-x-2 duration-300" size={28}/>
            { children }
        </Link>
    )
}

export default BackLink
