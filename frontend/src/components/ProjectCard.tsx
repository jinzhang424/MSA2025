import { type FC } from 'react';
import { Link } from 'react-router';
import { FiCalendar } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { type ProjectCardProps } from '../api/Project';

const ProjectCard: FC<ProjectCardProps> = ({
  projectId,
  title,
  description,
  image,
  category,
  spotsAvailable,
  totalSpots,
  duration,
  skills
}) => {

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      {/* Image and category */}
      <div className="relative h-48 overflow-hidden">
        <img src={image || '/project-img-replacement.png'} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 bg-purple-950/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
          {category}
        </div>
      </div>

      {/* Project info */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Title and description */}
        <h3 className="text-xl font-bold mb-2 line-clamp-2 text-navy">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">{description}</p>

        {/* Skills needed */}
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.slice(0, 3).map((skill, index) => 
            <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
              {skill}
            </span>)}
            
          {skills.length > 3 && 
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              +{skills.length - 3} more
            </span>}
        </div>
        
        {/* Spots left and deadline */}
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4 mt-3">
          {/* Spots left */}
          <div className="flex items-center">
            <LuUsers className="h-4 w-4 mr-1" />
            <span>
              {`${spotsAvailable}/${totalSpots}`}
            </span>
          </div>

          {/* Deadline */}
          {duration && <div className="flex items-center">
              <FiCalendar className="h-4 w-4 mr-1" />
              <span>Duration {duration || "TBD"}</span>
            </div>}
        </div>
        <Link to={`/project/${projectId}`} className="bg-purple-950 duration-200 text-slate-100 px-4 py-2 rounded-md hover:bg-purple-800 text-center font-semibold">
          View Project
        </Link>
      </div>
    </div>
  )
};
export default ProjectCard;