import BGFadeButton from "./buttons/BGFadeButton"

function ReadyToStart() {
    return (
        <div className="bg-purple-950 bg-gradient-to-br from-orange-300 p-16 text-center text-white space-y-12">
            <div className="flex flex-col justify-center items-center space-y-4">
                <h1 className="text-white text-4xl font-bold">Ready To Start Your Journey?</h1>
                <h2 className="max-w-1/2 text-lg">
                    Join our community of creators, developers, and designers to find your next collaborative project.
                </h2>
            </div>

            <div className="flex space-x-8 justify-center grid-cols-2">
                <BGFadeButton className="p-4 pl-5 pr-5 w-44">
                    Discover Projects
                </BGFadeButton>
                <BGFadeButton bgFade={true} className="p-4 pl-5 pr-5 w-44">
                    Create Project
                </BGFadeButton> 
            </div>
        </div>
    )
}

export default ReadyToStart
