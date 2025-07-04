import WhoIsItForCard from "./WhoIsItForCard";
import { GoPeople } from "react-icons/go";
import { PiStudent } from "react-icons/pi";
import { PiSuitcase } from "react-icons/pi";


function WhoIsItFor() {
  return (
    <div className="flex flex-col p-16 space-y-12">
        <header className="flex flex-col justify-center items-center space-y-4 text-black">
          <h1 className="text-4xl font-bold">Who is CoCreate For?</h1>
          <h2 className="flex flex-col justify-center items-center text-center text-gray-700">
              <p>Our platform is designed to help everyone from students to professionals connect and</p>
              <p>collaborate.</p>
          </h2>
        </header>

        <div className="flex space-x-12">
          <WhoIsItForCard 
            icon={<PiStudent className="w-full h-full text-purple-800"/>} 
            title="Students" 
            bodyText="Gain practical experience, build your portfolio, and connect with mentors in your field of interest."
          />
          <WhoIsItForCard 
            icon={<PiSuitcase className="w-full h-full text-purple-800"/>} title="Professionals" 
            bodyText="Find side projects, mentor upcoming talent, or collaborate with others on innovative ideas."
          />
          <WhoIsItForCard 
            icon={<GoPeople className="w-full h-full text-purple-800"/>} 
            title="Teams" 
            bodyText="Build your dream team for projects by connecting with individuals who have complementary skills." 
          />
        </div>
    </div>
  )
}

export default WhoIsItFor
