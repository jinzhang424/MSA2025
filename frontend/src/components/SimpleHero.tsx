import BackLink from "./BackLink";

interface SimpleHeroProps{
    heading: string,
    subheading?: string
}

function SimpleHero({ heading, subheading } : SimpleHeroProps) {
    return (
        <div className='flex flex-col gap-3 justify-center items-center bg-purple-950 bg-gradient-to-br from-orange-300 h-[400px] p-16'>
            <BackLink to="/">
                Back to home
            </BackLink>
            
            <h1 className='text-white text-4xl font-bold text-center'>{heading}</h1>
            <h2 className='text-slate-200 font-semibold text-center'>{subheading}</h2>

            <div className="absolute h-[400px] w-full bg-gradient-to-b to-black/10 pointer-events-none"/>
        </div>
    )
}

export default SimpleHero
