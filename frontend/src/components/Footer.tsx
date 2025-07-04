import { FaXTwitter } from "react-icons/fa6";
import { SiDiscord } from "react-icons/si"
import { FaGithub } from "react-icons/fa";
import FooterLinkSection from "./FooterLinkSection";
import { MdOutlineCopyright } from "react-icons/md";
import { Link } from "react-router";

function Footer() {
    return (
        <div className='bg-navy p-12 pb-10'>
            <div className="flex">
                <div className="flex flex-col space-y-8">
                    <div className="flex flex-col space-y-2">
                        <h1 className='text-slate-50 text-2xl font-bold'>CoCreate</h1>
                        <h2 className='text-slate-300 max-w-96'>Connect with talented individuals and teams for your next remote project.</h2>
                    </div>
                    <div className="flex space-x-3">
                        <FaXTwitter className="w-8 h-8 p-1 rounded-sm bg-slate-100"/>
                        <FaGithub className="w-8 h-8 p-1 rounded-sm bg-slate-100"/>
                        <SiDiscord className="w-8 h-8 p-1 rounded-sm bg-slate-100"/>
                    </div>
                </div>

                {/* Other Links */}
                <div className="flex space-x-24 ml-auto mr-auto">
                    <FooterLinkSection title="Platform">
                        <Link to="">Discover Projects</Link>
                        <Link to="">Create Project</Link>
                        <Link to="">About Us</Link>
                    </FooterLinkSection>
                    <FooterLinkSection title="Company">
                        <Link to="">Privacy Policy</Link>
                        <Link to="">Terms Of Service</Link>
                    </FooterLinkSection>
                    <FooterLinkSection title="Auth">
                        <Link to="">Register</Link>
                        <Link to="">Login</Link>
                    </FooterLinkSection>
                </div>
            </div>

            <div className="w-full bg-white h-0.5 opacity-20 mt-10"/>
            <div className="flex text-slate-300 w-full justify-center space-x-2 items-center mt-10">
                <MdOutlineCopyright className="w-6 h-6 2025 Marketeam. All rights reserved."/>
                <p>2025 CoCreate. All rights reserved.</p>
            </div>
        </div>
    )
}

export default Footer
