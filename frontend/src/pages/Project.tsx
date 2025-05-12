import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { Project } from "../interfaces"
import { TemplateSection } from '../components/TemplateSection';
import { Spinner } from '../components/Spinner';

export const ProjectPage = () => {
  const { id } = useParams();
  const [ project, setProject ] = useState<Project>()
  const [ loading, setLoading ] = useState(true)

  const [userID] = useState(localStorage.getItem("userID"));

  useEffect(() => {
    let mounted = true;

    const fetchProject = async () => {
      try {
        if (userID && id) {
          const response = await apiService.getProject(userID, id)
          if (response.data && mounted) {
            setProject(response.data)
            console.log(response.data)
          }
        }
      } catch (error) {
        if (mounted) {
          console.log("Error fetching project: ", error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
    return () => { mounted = false }
  }, [id, userID])

  if (loading) {
    return (
      <Spinner statusMessage='Loading Project...' />
    )
  }

  return (
    <div className="ml-20 mr-20 mt-25">
      {project?.templates && <TemplateSection templates={project.templates} />}
    </div>
  );
};