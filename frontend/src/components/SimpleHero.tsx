import { useSelector } from "react-redux";
import BackLink from "./BackLink";
import type { RootState } from "../store/store";
import BGFadeButton from "./buttons/BGFadeButton";
import { useNavigate } from "react-router";

interface SimpleHeroProps{
    heading: string,
    subheading?: string
}

/**
 * 
 * @param heading - heading of the hero
 * @param subheading- subheading of the hero 
 * @returns - A hero with a gradient background and centered text.
 */
function SimpleHero({ heading, subheading } : SimpleHeroProps) {
    const user = useSelector((state: RootState) => state.user);
    const navigate = useNavigate()

    return (
        <div className='flex flex-col gap-3 justify-center items-center bg-purple-950 bg-gradient-to-br from-orange-300 h-[400px] p-16'>
            <BackLink to="/">
                Back to home
            </BackLink>

            {user.token && (
                <div className="absolute top-6 right-10">
                    <BGFadeButton onClick={() => navigate('/dashboard')} className="px-5 py-2" bgFade={true}>
                        Dashboard
                    </BGFadeButton>
                </div>
            )}
            
            <h1 className='text-white text-4xl font-bold text-center'>{heading}</h1>
            <h2 className='text-slate-200 font-semibold text-center'>{subheading}</h2>

            <div className="absolute h-[400px] w-full bg-gradient-to-b to-black/10 pointer-events-none"/>
        </div>
    )
}

export default SimpleHero
