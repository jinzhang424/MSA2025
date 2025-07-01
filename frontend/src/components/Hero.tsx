

const Hero = () => {
    return (
        <div className="flex items-center w-full h-screen p-12 bg-purple-950 bg-gradient-to-br from-orange-300">
            <div className="flex flex-col space-y-3">
                <header className="text-6xl font-bold text-white">
                    <h1>Connect,</h1>
                    <h1>Collaborate,</h1>
                    <h1>Create.</h1>
                </header>
                
                <h2 className="text-xl text-white">
                    <p>Find remote projects and connect with talented</p>
                    <p>individuals in Software Development, Computer Science, </p>
                    <p>Graphic Design, and more.</p>
                </h2>
                
                <div className="flex mt-4 space-x-4 font-semibold">
                    <button className="p-3 pl-5 pr-5 text-white bg-black rounded-sm hover:cursor-pointer">
                        Discover Projects
                    </button>
                    <button className="p-3 pl-5 pr-5 bg-white rounded-sm hover:cursor-pointer">
                        Create Project
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Hero
