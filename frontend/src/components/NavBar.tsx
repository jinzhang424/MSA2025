import { Link } from "react-router"

export default function NavBar() {
    return (
        <div className="absolute grid grid-cols-3 items-center justify-between w-full p-5 pl-7 pr-7 z-10">
            <header className="text-3xl font-bold text-white">CoCreate</header>

            <div className="flex font-semibold text-white justify-around items-center">
                <Link to="/" className="hover:underline underline-offset-2">Discover</Link>
                <Link to="/" className="hover:underline underline-offset-2">Create Project</Link>
                <Link to="/" className="hover:underline underline-offset-2">About Us</Link>
            </div>

            <div className="flex items-center space-x-4 font-semibold justify-end">
                <Link to="/" className="text-white">Login</Link>
                <button className="p-2 pl-5 pr-5 text-white bg-black rounded-md">Join Us</button>
            </div>
        </div>
    )
}
