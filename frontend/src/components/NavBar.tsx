import { Link } from "react-router"

export default function NavBar() {
    return (
        <div className="flex items-center justify-between w-full p-5 bg-white pl-7 pr-7">
            <header className="text-2xl font-bold text-black">CoCreate</header>
            <div className="flex space-x-8 font-semibold">
                <Link to="/">Discover</Link>
                <Link to="/">Create Project</Link>
                <Link to="/">About Us</Link>
            </div>

            <div className="flex items-center space-x-4 font-semibold">
                <Link to="/">Login</Link>
                <button className="p-2 pl-5 pr-5 text-white bg-black rounded-md">Join Us</button>
            </div>
        </div>
    )
}
