import { Link } from "react-router"
import { IoIosArrowRoundBack } from "react-icons/io";

interface SimpleHeroProps{
    heading: string,
    subheading?: string
}

function SimpleHero({ heading, subheading } : SimpleHeroProps) {
    return (
        <div className='flex flex-col gap-3 justify-center items-center bg-purple-950 bg-gradient-to-br from-orange-300 min-h-[400px]'>
            <Link className="group flex gap-2 items-center absolute top-6 left-12 font-semibold text-white text-md" to="/">
                <IoIosArrowRoundBack className="group-hover:-translate-x-2 duration-300" size={28}/>
                Back to home
            </Link>
            
            <h1 className='text-white text-4xl font-bold text-center'>{heading}</h1>
            <h2 className='text-slate-200 font-semibold text-center'>{subheading}</h2>
        </div>
    )
}

export default SimpleHero
