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
            <div className="relative flex justify-center items-center w-full h-screen p-4 sm:p-8 md:p-16 lg:p-26 bg-purple-950 bg-gradient-to-br from-orange-300">
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
                
                {/* Logos */}
                <div className="relative w-full h-screen">
                    {/* Miro */}
                    <img 
                        className="absolute w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 top-1/6 left-1/4 sm:left-1/3 -rotate-6 drop-shadow-[0_0_10px_rgba(253,182,105,0.6)]" 
                        src="https://cdn.brandfetch.io/idAnDTFapY/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B" 
                        alt="" 
                    />
                    
                    {/* Figma */}
                    <img 
                        className="absolute w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 top-1/7 right-1/5 sm:right-1/4 rotate-18 rounded-2xl drop-shadow-[0_0_10px_rgba(253,182,105,0.3)]" 
                        src="/figma-logo.svg" 
                        alt="" 
                    />
                    
                    {/* Github */}
                    <img 
                        className="absolute w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 left-1/5 sm:left-1/4 top-2/3 -rotate-12 drop-shadow-[0_0_10px_rgba(253,182,105,0.4)]" 
                        src="/github-logo.svg" 
                        alt="" 
                    />
                    
                    {/* After Effect */}
                    <img 
                        className="absolute w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 right-1/5 sm:right-1/4 bottom-1/8 rotate-6 rounded-md shadow-orange-300/10 drop-shadow-[0_0_10px_rgba(253,182,105,0.3)]" 
                        src="/aftereffects-logo.svg" 
                        alt="" 
                    />
                    
                    {/* VS Code */}
                    <img 
                        className="absolute -rotate-12 w-10 h-10 sm:w-16 sm:h-16 md:w-18 md:h-18 drop-shadow-[0_0_10px_rgba(253,182,105,0.3)] top-1/4 left-2 sm:left-4 md:left-8" 
                        src="/vscode-logo.svg" 
                        alt="" 
                    />
                    
                    {/* Photoshop */}
                    <img 
                        className="absolute w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 right-[8%] sm:right-[5%] bottom-1/3 rounded-lg shadow-orange-300/10 drop-shadow-[0_0_10px_rgba(253,182,105,0.3)] -rotate-6" 
                        src="/photoshop-logo.png" 
                        alt="" 
                    />
                </div>
                
                {/* Main section of hero */}
                <div className="absolute flex flex-col justify-center items-center space-y-8 sm:space-y-12 md:space-y-16 mt-4 sm:mt-8 md:mt-12 px-4 sm:px-8">
                    {/* Heading and subheader */}
                    <div className="flex flex-col justify-center items-center text-white space-y-2 sm:space-y-3 md:space-y-4 text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                            Connect, Collaborate, Create.
                        </h1>
                        <h2 className="flex font-semibold text-sm sm:text-base md:text-lg px-4 sm:px-0">
                            Connect with others. Collaborate on projects. Create your vision.
                        </h2>
                    </div>

                    {/* Get started */}
                    <div className="flex flex-col space-y-2 sm:space-y-3 justify-center items-center">
                        <button className="peer p-2 sm:p-3 pl-4 sm:pl-6 md:pl-7 pr-4 sm:pr-6 md:pr-7 border-2 border-navy text-white bg-navy rounded-sm hover:cursor-pointer font-semibold drop-shadow-xs text-sm sm:text-base">
                            <p>Get Started</p>
                        </button>
                        <CgChevronDown 
                            size={window.innerWidth < 640 ? 20 : 24} 
                            color="white" 
                            className="peer-hover:translate-y-2 duration-300 ease-in-out"
                        />
                    </div>
                </div>

                {/* Bottom gradient overlay */}
                <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"/>
            </div>
        </div>
    )
}

export default Hero