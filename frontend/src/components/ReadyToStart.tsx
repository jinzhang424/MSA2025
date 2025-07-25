import { useNavigate } from "react-router"
import BGFadeButton from "./buttons/BGFadeButton"

function ReadyToStart() {
    const navigate = useNavigate();

    return (
        <div className="bg-purple-950 bg-gradient-to-br from-orange-300 p-16 text-center text-white space-y-8">
            <div className="flex flex-col justify-center items-center space-y-4">
                <h1 className="text-white text-4xl font-bold">Ready To Start?</h1>
                <h2 className="min-w-[300px] max-w-1/2 text-lg">
                    Join our community of creators, developers, and designers to find your next collaborative project.
                </h2>
            </div>

            <div className="flex gap-8 justify-center grid-cols-2 flex-wrap items-center">
                <BGFadeButton className="px-8 py-3" onClick={() => navigate('/register')}>
                    Join Now
                </BGFadeButton>
            </div>
        </div>
    )
}

export default ReadyToStart
