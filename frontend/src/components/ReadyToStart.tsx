

function ReadyToStart() {
    return (
        <div className="bg-purple-950 bg-gradient-to-br from-orange-300 p-16 text-center text-white space-y-12">
            <div className="flex flex-col justify-center items-center space-y-4">
                <h1 className="text-white text-4xl font-bold">Ready To Start Your Journey?</h1>
                <h2 className="max-w-1/2 text-lg">
                    Join our community of creators, developers, and designers to find your next collaborative project.
                </h2>
            </div>

            <div className="flex space-x-8 justify-center">
                <button className="bg-white border-3 border-white p-4 pl-5 pr-5 text-purple-950 rounded-md font-semibold w-full max-w-44 cursor-pointer">
                    Discover Projects
                </button>
                <button className="border-3 border-white p-4 pl-5 pr-5 text-white rounded-md font-semibold w-full max-w-44 cursor-pointer">
                    Create Project
                </button>
            </div>
        </div>
    )
}

export default ReadyToStart
