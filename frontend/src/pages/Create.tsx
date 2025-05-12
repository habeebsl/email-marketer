import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DataForm } from "../components/DataForm"
import { GenerateICP } from "../components/GenerateICP"
import { GenerateTemplates } from "../components/GenerateTemplates"
import { ProjectName } from "../components/ProjectName"
import { Spinner } from "../components/Spinner"
import { apiService } from "../services/api"
import { useData } from "../store/useDataStore"
import { Notification } from "../components/Notification"

export function CreatePage () {
  const navigate = useNavigate()
  const { templates, projectName, currentStep, setCurrentStep, icps } = useData()
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error",
    isVisible: false,
  });

  useEffect(() => {
    if (currentStep === 4) {
      setLoading(true);
      saveProjectData()
    }
  }, [currentStep])

  const saveProjectData = async () => {
    try {
      const steps = [
        "Saving Project Name...",
        "Saving Templates...",
      ];

      for (const message of steps) {
        setStatusMessage(message);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      const userID = localStorage.getItem("userID")

      if (!userID) {
        throw new Error("User is not logged in");
      }

      const projectResponse = await apiService.createProject(userID, projectName, templates)

      if (!projectResponse.data || !projectResponse.data.id) {
        throw new Error("Invalid response: Project data is missing");
      }

      const newSteps = [
        "Saving ICPs...",
        "Almost done...",
      ];

      for (const message of newSteps) {
        setStatusMessage(message);
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      const icpResponse = await apiService.addICPs(projectResponse.data.id, icps)

      if (!icpResponse.data) {
        throw new Error("Invalid response: ICP data as not saved");
      }
      
      setNotification({
        message: "Project saved successfully!",
        type: "success",
        isVisible: true,
      });

      setLoading(false)
      navigate(`/project/${projectResponse.data.id}`)

    } catch (error) {
      console.error(error)
      setNotification({
        message: "Error saving project. Please try again.",
        type: "error",
        isVisible: true,
      });
      setLoading(false)
      navigate("/dashboard")
    } finally {
      setCurrentStep(0)
    }
  } 


  return (
    <>
      {currentStep===0 && <DataForm />}
      {currentStep===1 && <GenerateICP />}
      {currentStep===2 && <GenerateTemplates />}
      {currentStep===3 && <ProjectName />}
      {loading && <Spinner statusMessage={statusMessage} />}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() =>
          setNotification((prev) => ({ ...prev, isVisible: false }))
        }
      />
    </>
  )
}