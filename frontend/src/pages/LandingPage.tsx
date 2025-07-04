import NavBar from "../components/NavBar"
import Hero from "../components/Hero"
import HowItWorks from "../components/HowItWorks"
import WhoIsItFor from "../components/WhoIsItFor"

export default function LandingPage() {
    return (
        <div className="relative w-full bg-gray-100">
            <title>Home</title>
            
            <div className="absolute w-full">
                <NavBar/>
            </div>
            <Hero/>

            <HowItWorks/>
            <WhoIsItFor/>
        </div>
    )
}
