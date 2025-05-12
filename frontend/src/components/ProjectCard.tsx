import { LoadingBar } from "./LoadingBar";
import { useNavigate } from "react-router-dom";

interface ProjectCard {
    id: string;
    name: string;
    sent: number;
    templates: number;
    icp: number;
}

export function ProjectCard({ id, name, sent, templates, icp }: ProjectCard) {

  const navigate = useNavigate()

  const getProgress = (current: number, max: number) => {
    return (current / max) * 100
  }

  const handleClick = () => {
    navigate(`/project/${id}`)
  }
  
  return (
    <div 
      onClick={handleClick} 
      className="relative p-4 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-white w-72"
    >
      {/* Project Title */}
      <div className="mb-4">
        <h3 className="text-lg font-bold tracking-tight">{name}</h3>
        <div className="h-0.5 w-12 bg-indigo-400 mt-1 rounded-full"></div>
      </div>

      {/* Stats Container */}
      <div className="space-y-3">
        {/* Sent Progress */}
        <div className="bg-indigo-700/30 p-2.5 rounded-md">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-indigo-200">Sent</span>
            <span className="text-xs font-medium text-indigo-200">
              {sent}
            </span>
          </div>
          <LoadingBar
            progress={getProgress(sent, 1000)}
            isIndeterminate={false}
            color="#818cf8"
            height="4px"
          />
        </div>

        {/* Templates Progress */}
        <div className="bg-indigo-700/30 p-2.5 rounded-md">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-indigo-200">
              Templates
            </span>
            <span className="text-xs font-medium text-indigo-200">
              {templates}
            </span>
          </div>
          <LoadingBar
            progress={getProgress(templates, 10)}
            isIndeterminate={false}
            color="#818cf8"
            height="4px"
          />
        </div>

        {/* ICP Progress */}
        <div className="bg-indigo-700/30 p-2.5 rounded-md">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-indigo-200">ICP</span>
            <span className="text-xs font-medium text-indigo-200">
              {icp}
            </span>
          </div>
          <LoadingBar
            progress={getProgress(icp, 10)}
            isIndeterminate={false}
            color="#818cf8"
            height="4px"
          />
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute top-0 right-0 -mt-2 -mr-2 h-8 w-8 bg-indigo-500 rounded-full opacity-10"></div>
    </div>
  );
}
