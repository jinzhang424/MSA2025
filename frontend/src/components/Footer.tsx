import { FaXTwitter } from "react-icons/fa6";
import { SiDiscord } from "react-icons/si"
import { FaGithub } from "react-icons/fa";
import FooterLinkSection from "./FooterLinkSection";
import { MdOutlineCopyright } from "react-icons/md";
import { Link } from "react-router";

function Footer() {
    const socialMediaIconStyle = "w-8 h-8 p-1 rounded-sm bg-slate-100 opacity-70 hover:opacity-100 duration-200 hover:cursor-pointer"

    return (
        <footer className='bg-navy p-12 pb-10'>
            <div className="flex flex-wrap gap-12">
                <div className="flex flex-col space-y-8 w-full max-w-[550px]">
                    <div className="flex flex-col space-y-2">
                        <h1 className='text-slate-50 text-2xl font-bold'>CoCreate</h1>
                        <h2 className='text-slate-300 max-w-96'>Connect with talented individuals and teams for your next remote project.</h2>
                    </div>
                    
                    {/* Social Media */}
                    <div className="flex space-x-3">
                        <FaXTwitter className={socialMediaIconStyle}/>
                        <FaGithub className={socialMediaIconStyle}/>
                        <SiDiscord className={socialMediaIconStyle}/>
                    </div>
                </div>

                {/* Other Links */}
                <div className="flex gap-x-20 gap-y-8 flex-wrap">
                    {/* Platform Links */}
                    <FooterLinkSection title="Platform">
                        <Link className="hover:underline" to="">Discover Projects</Link>
                        <Link className="hover:underline" to="">About Us</Link>
                    </FooterLinkSection>

                    {/* Legality Links */}
                    <FooterLinkSection title="Company">
                        <Link className="hover:underline" to="">Privacy Policy</Link>
                        <Link className="hover:underline" to="">Terms Of Service</Link>
                    </FooterLinkSection>

                    {/* Auth Links */}
                    <FooterLinkSection title="Auth">
                        <Link className="hover:underline" to="">Register</Link>
                        <Link className="hover:underline" to="">Login</Link>
                    </FooterLinkSection>
                </div>
            </div>

            <div className="w-full bg-white h-0.5 opacity-20 mt-10"/>

            {/* Copy Right */}
            <div className="flex text-slate-300 w-full justify-center space-x-2 items-center mt-10">
                <MdOutlineCopyright className="w-6 h-6 2025 Marketeam. All rights reserved."/>
                <p>2025 CoCreate. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer
