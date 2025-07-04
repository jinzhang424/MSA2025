import { Link } from "react-router"
import BGFadeButton from "./buttons/BGFadeButton"

export default function NavBar() {
    return (
        <header className="absolute grid grid-cols-3 items-center justify-between w-full p-5 pl-7 pr-7 z-10">
            <header className="text-3xl font-bold text-white">CoCreate</header>

            <div className="flex font-semibold text-white justify-around items-center">
                <Link to="/" className="hover:underline underline-offset-2">Discover</Link>
                <Link to="/" className="hover:underline underline-offset-2">Create Project</Link>
                <Link to="/" className="hover:underline underline-offset-2">About Us</Link>
            </div>

            <div className="flex items-center space-x-4 font-semibold justify-end">
                <BGFadeButton className="p-2 pl-5 pr-5">Login</BGFadeButton>
                <BGFadeButton className="p-2 pl-5 pr-5" bgFade={true}>Join Us</BGFadeButton>
            </div>
        </header>
    )
}
