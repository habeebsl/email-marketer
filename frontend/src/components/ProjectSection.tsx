import { ButtonSpinner } from "./ButtonSpinner"
import { ProjectCard } from "../components/ProjectCard"
import { apiService } from "../services/api"
import { useEffect, useState } from "react"
import type { Project } from "../interfaces"

export function ProjectSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const userID = localStorage.getItem("userID")
        if (userID) {
          const response = await apiService.getProjects(userID)
          if (response.data?.projects) {
            setProjects(response.data.projects)
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (projects.length === 0) {
    return (
      <div className="w-full">
        <div className="h-[242px] w-72 bg-gray-200 rounded-lg flex items-center justify-center">
          {!loading ? (
            <p className="text-gray-500">No projects found</p>
          ): (
            <ButtonSpinner textColorClass="text-black" />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex overflow-x-auto no-scrollbar gap-6 py-4 px-2">
        {[...projects]
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .map((project) => {
            const totalSent = project.templates.reduce(
              (sum, template) => sum + template.total_sent,
              0
            )
  
            return (
              <div key={project.id} className="flex-shrink-0">
                <ProjectCard 
                  id={project.id}
                  name={project.project_name}
                  sent={totalSent}
                  templates={project.templates.length}
                  icp={project.icp_subsets.length}
                />
              </div>
            )
          })}
      </div>
    </div>
  )    
}