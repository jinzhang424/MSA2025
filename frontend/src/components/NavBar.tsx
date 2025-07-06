import { Link } from "react-router"
import BGFadeButton from "./buttons/BGFadeButton"
import { RiMenuLine } from "react-icons/ri";
import { ImCompass } from "react-icons/im";
import { IoCreateOutline } from "react-icons/io5"
import { AiOutlineTeam } from "react-icons/ai"
import { RiLoginBoxLine } from "react-icons/ri";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function NavBar() {
    const [openMenu, setOpenMenu] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navbarLinks = [
        {
            icon: <ImCompass className="mr-4" size={20}/>,
            header: "Discover",
            to: "/discover-projects"
        },
        {
            icon: <IoCreateOutline className="mr-4" size={20}/>,
            header: "Create Project",
            to: "/create-project"
        },
        {
            icon: <AiOutlineTeam className="mr-4" size={20}/>,
            header: "About Us",
            to: "/about-us"
        },
    ]

    const useMenu = windowWidth < 1200;

    return (
        useMenu ? (
            // Menu navigation
            <nav className="relative z-10 text-white">
                <h1 className="absolute p-5 pl-7 text-3xl font-bold w-fit">CoCreate</h1>

                <button 
                    className="absolute right-0 z-20 p-4 cursor-pointer opacity-60 hover:opacity-100 duration-200"
                    onClick={() => {openMenu ? setOpenMenu(false) : setOpenMenu(true)}}
                >
                    <RiMenuLine color="white" size={35}/>
                </button>

                <div className="relative w-full h-screen overflow-hidden">
                    <div 
                        className="absolute flex flex-col justify-between right-0 z-10 h-screen max-w-[100%] min-w-[300px] bg-black/50 backdrop-blur-xs bg-gradient-to-b from-navy shadow-[-5px_0px_10px_rgba(0,0,0,0.2)] border-l-2 border-white/5 pt-16 duration-300"
                        style={{
                            transform: `translateX(${openMenu ? '0' : '100'}%)`
                        }}
                    >
                        <div className="flex flex-col font-semibold justify-around items-center">
                            {navbarLinks.map((linkInfo, i) => (
                                <Link 
                                    className="flex items-center p-4 pl-6 w-full hover:bg-white/5 duration-300" 
                                    to={linkInfo.to} 
                                    key={i}
                                >
                                    {linkInfo.icon}
                                    {linkInfo.header}
                                </Link>
                            ))}
                        </div>

                        <div className="flex flex-col items-center font-semibold justify-end">
                            <Link to="/sign-in" className="flex p-4 pl-6 w-full hover:bg-white/5 duration-300">
                                <RiLoginBoxLine className="mr-4" size={24}/>
                                Login
                            </Link>
                            <Link to="/" className="flex p-4 pl-6 w-full hover:bg-white/5 duration-300">
                                <MdOutlinePersonAddAlt1 className="mr-4" size={24}/>
                                Join Us
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
         ) : (
            // Navbar navgiation
            <nav className="absolute grid grid-cols-3 items-center justify-between w-full p-5 pl-7 pr-7 z-10">
                <h1 className="text-3xl font-bold text-white">CoCreate</h1>

                <div className="flex font-semibold text-white justify-around items-center">
                    {navbarLinks.map((linkInfo, i) => (
                        <Link to={linkInfo.to} className="hover:underline underline-offset-2" key={i}>
                            {linkInfo.header}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center space-x-4 font-semibold justify-end">
                    <BGFadeButton className="p-2 pl-5 pr-5" onClick={() => navigate("/sign-in")}>Login</BGFadeButton>
                    <BGFadeButton className="p-2 pl-5 pr-5" bgFade={true}>Join Us</BGFadeButton>
                </div>
            </nav>
         )
    )
}
