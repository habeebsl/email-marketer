import { useState, useEffect } from "react";
import { Spinner } from "./Spinner";
import { Notification } from "./Notification";
import { apiService } from "../services/api";
import { useData } from "../store/useDataStore";

export function GenerateTemplates() {
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const { formData, setTemplates, setCurrentStep } = useData()
  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error",
    isVisible: false,
  });

  useEffect(() => {
    generateTemplates()
  }, [])

  const generateTemplates = async () => {
    try {
      const steps = [
        "Generating Templates...",
        "Almost Done..."
      ];

      for (const message of steps) {
        setStatusMessage(message);
        await new Promise((resolve) => setTimeout(resolve, 4000));
      }

      const response = await apiService.generateTemplates(
        formData.pain_point, 
        formData.offer_summary, 
        formData.cta_line
      )

      const parsedData = JSON.parse(response.data)

      if (!parsedData || !parsedData.templates) {
        throw new Error("Invalid response: Templates data is missing");
      }

      setTemplates(parsedData.templates)

      setNotification({
        message: "Templates generated successfully!",
        type: "success",
        isVisible: true,
      });

      setCurrentStep(3)
    } catch (error) {
      console.log("Error while generating templates: ", error)
      setNotification({
        message: "Failed to generate templates. Please try again.",
        type: "error",
        isVisible: true,
      });
    } finally {
      setStatusMessage("");
      setLoading(false);
    }
  }

  return (
    <div>
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() =>
          setNotification((prev) => ({ ...prev, isVisible: false }))
        }
      />
      {loading && <Spinner statusMessage={statusMessage} /> }
    </div>
  )
}