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
            <div className="relative flex justify-center items-center w-full h-screen p-26 bg-purple-950 bg-gradient-to-br from-orange-300 blur-">
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
                    <img className="absolute w-14 h-14 top-1/6 left-1/3 -rotate-6 drop-shadow-[0_0_10px_rgba(253,182,105,0.6)]" src="https://cdn.brandfetch.io/idAnDTFapY/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B" alt="" />
                    <img className="absolute w-16 h-16 top-1/7 right-1/4 rotate-18 rounded-2xl drop-shadow-[0_0_10px_rgba(253,182,105,0.3)]" src="/figma-logo.svg" alt="" />
                    <img className="absolute w-16 h-16 left-1/4 top-2/3 -rotate-12 drop-shadow-[0_0_10px_rgba(253,182,105,0.4)]" src="/github-logo.svg" alt="" />
                    <img className="absolute w-14 h-14 right-1/4 bottom-1/8 rotate-6 rounded-md shadow-orange-300/10 drop-shadow-[0_0_10px_rgba(253,182,105,0.3)]"  src="/aftereffects-logo.svg" alt="" />
                    <img className="absolute -rotate-12 w-18 h-18 drop-shadow-[0_0_10px_rgba(253,182,105,0.3)] top-1/4" src="/vscode-logo.svg" alt="" />
                    <img className="absolute w-16 h-16 right-[5%] bottom-1/3 rounded-lg shadow-orange-300/10 drop-shadow-[0_0_10px_rgba(253,182,105,0.3)] -rotate-6" src="/photoshop-logo.png" alt="" />
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

                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"/>
            </div>
        </div>
    )
}

export default Hero
