import NavBar from "../components/NavBar"
import Hero from "../components/Hero"

export default function LandingPage() {
    return (
        <div className="relative w-full">
            <title>Home</title>
            
            <div className="absolute w-full">
                <NavBar/>
            </div>
            <Hero/>
        </div>
    )
}
