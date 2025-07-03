import { useEffect, useState } from "react";
import { CgChevronDown } from "react-icons/cg";

const Hero = () => {
    const [scrollOffset, setScrollOffset] = useState(0) 

    useEffect(() => {
        const handleScroll = () => {
            setScrollOffset(window.scrollY);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div>
            <div className="flex justify-center items-center w-full h-screen p-26">
                <div className="absolute flex w-full overflow-hidden justify-center">
                    {/* Left piece */}
                    <div 
                        className="top-0 left-0 inset-0 h-screen w-1/2 bg-navy duration-150 ease-in-out"
                        style={{
                            clipPath: `polygon(
                                0% 0%, 
                                90% 0%, 
                                75% 100%, 
                                0% 100%
                            )`,
                            filter: `url(#noise-effect)`,
                            backgroundImage: "url('/grid.svg')",
                            backgroundSize: 1350,
                            backgroundPosition: 'center',
                            transform: `translateX(-${scrollOffset}px)`
                        }}
                    />
                    
                    {/* Right piece */}
                    <div 
                        className="top-0 left-0 h-screen w-1/2 inset-0 bg-navy duration-150 ease-in-out"
                        style={{
                            clipPath: `polygon(
                                10% 0%,
                                100% 0%,
                                100% 100%,
                                25% 100%
                            )`,
                            filter: `url(#noise-effect)`,
                            backgroundImage: "url('/grid.svg')",
                            backgroundSize: 1350,
                            backgroundPosition: 'center',
                            transform: `translateX(${scrollOffset}px)`
                        }}
                    />
                </div>
                
                {/* Main section of hero */}
                <div className="absolute flex flex-col justify-center items-center space-y-16 mt-12">
                    <header className="flex flex-col justify-center items-center text-white space-y-2 text-center">
                        <h1 className="text-7xl font-bold">
                            Connect, Collaborate, Create.
                        </h1>
                        <h2 className="flex font-semibold text-lg">
                            Connect with others. Collaborate on projects. Create your vision.
                        </h2>
                    </header>

                    {/* Get started */}
                    <div className="flex flex-col space-y-3 justify-center items-center">
                        <button className="peer p-3 pl-7 pr-7 border-2 border-navy text-white bg-navy rounded-sm hover:cursor-pointer font-semibold drop-shadow-xs">
                            <p>Get Started</p>
                        </button>
                        <CgChevronDown size={24} color="white" className="peer-hover:translate-y-2 duration-300 ease-in-out"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero
