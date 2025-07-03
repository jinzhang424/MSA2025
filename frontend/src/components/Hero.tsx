import { useEffect, useState } from "react";
import { CgChevronDown } from "react-icons/cg";

const Hero = () => {
    const [screenSize, setScreenSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    });

    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div>
            <svg className="absolute w-full h-full">
                <defs>
                    {/* Noise effect filter */}
                    <filter id="noise-effect" x="0" y="0" width="100%" height="100%">
                        <feTurbulence type="fractalNoise" baseFrequency="1" numOctaves="2" stitchTiles="stitch" />
                        <feBlend mode="multiply" in="SourceGraphic" />
                    </filter>

                    {/* Clipping paths for polygons */}
                    <clipPath id="combined-clip">
                        <path 
                            d={`
                                M 0,0 
                                L ${screenSize.width * 0.46},0
                                Q ${screenSize.width * 0.4},${screenSize.height * 0.8} ${screenSize.width * 0.35},${screenSize.height} 
                                L 0,${screenSize.height}
                                Z
                            `}
                        />
                    {/* Second path with curve */}
                    <path 
                        d={`
                            M ${screenSize.width},0 
                            L ${screenSize.width * 0.54}, 0
                            Q ${screenSize.width * 0.6},${screenSize.height * 0.8} ${screenSize.width * 0.65},${screenSize.height}
                            L ${screenSize.width},${screenSize.height}  
                            Z
                        `}
                    />
                    </clipPath>
                </defs>
            </svg>

            <div className="flex justify-center items-center w-full h-screen p-26 bg-purple-950 bg-gradient-to-br from-orange-300">
                {/* Overlay HTML grid */}
                <div 
                    className="absolute top-0 left-0 h-full flex bg-navy w-full"
                    style={{
                        clipPath: `url(#combined-clip)`,
                        filter: `url(#noise-effect)`
                    }}
                >
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
                        <button className="peer p-3 pl-7 pr-7 text-white bg-navy rounded-sm hover:cursor-pointer font-semibold drop-shadow-xs hover:scale-110 duration-300 ease-in-out">
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
