import { useState } from "react";
import { useData } from "../store/useDataStore";
import { ButtonSpinner } from "./ButtonSpinner";
import { Notification } from "./Notification";

export function ProjectName() {
  const { projectName, setProjectName, setCurrentStep } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
    isVisible: boolean;
  }>({ message: "", type: "success", isVisible: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setNotification({
        message: "Project name saved successfully!",
        type: "success",
        isVisible: true,
      });

      setCurrentStep(4)
    } catch (error) {
      console.error("Submission failed:", error);
      setNotification({
        message: "Failed to save project name. Please try again.",
        type: "error",
        isVisible: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() =>
          setNotification((prev) => ({ ...prev, isVisible: false }))
        }
      />
      <form className="space-y-6 w-100" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="projectName"
            className="block text-sm font-medium text-gray-300"
          >
            Project Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="projectName"
              name="projectName"
              required
              className="text-[white] appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <ButtonSpinner />
                Saving...
              </span>
            ) : (
              "Save Project Name"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
