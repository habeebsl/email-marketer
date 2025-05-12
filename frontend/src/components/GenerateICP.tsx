import { useState, useEffect } from "react";
import { useData } from "../store/useDataStore";
import { Notification } from "./Notification";
import { Spinner } from "./Spinner";
import { apiService } from "../services/api";


export function GenerateICP() {
  const [loading, setLoading] = useState(true);
  const { formData, icps, setIcps, setCurrentStep } = useData();
  const [statusMessage, setStatusMessage] = useState("");
  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error",
    isVisible: false,
  });

  useEffect(() => {
    generateICPs();
  }, []);

  const generateICPs = async () => {
    try {
      const steps = [
        "Analyzing pain point...",
        "Analyzing offer summary...",
        "Identifying potential customer segments...",
        "Finalizing ideal customer profiles...",
      ];

      for (const message of steps) {
        setStatusMessage(message);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      const response = await apiService.generateICPs(
        formData.pain_point, 
        formData.offer_summary
      )

      const parsedData = JSON.parse(response.data)

      if (!parsedData || !parsedData.icps) {
        throw new Error("Invalid response: ICPs data is missing");
      }

      setIcps(parsedData.icps);


      setNotification({
        message: "ICPs generated successfully!",
        type: "success",
        isVisible: true,
      });
    } catch (error) {
      console.log("Failed to generate ICPs: ", error)
      setNotification({
        message: "Failed to generate ICPs. Please try again.",
        type: "error",
        isVisible: true,
      });
    } finally {
      setStatusMessage("");
      setLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentStep(2)
    console.log("Next button clicked");
  };

  return (
    <div className="min-h-screen p-8">
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() =>
          setNotification((prev) => ({ ...prev, isVisible: false }))
        }
      />

      {loading && <Spinner statusMessage={statusMessage} />}

      {icps.length > 0 && (
        <div className="mt-40 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {icps.map((icp, index) => (
              <div
                key={index}
                className="relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 
                rounded-xl border border-slate-700/50 shadow-lg hover:shadow-xl 
                transform hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className="absolute top-0 right-0 -mt-2 -mr-2 h-24 w-24 
                bg-blue-500/10 rounded-full blur-2xl"
                ></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <svg
                        className="w-6 h-6 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      { icp }
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

            <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="mt-12 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 
              text-white rounded-lg hover:from-blue-700 hover:to-blue-800 
              transition-all duration-300 shadow-lg hover:shadow-xl 
              transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              Continue
              <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
              </svg>
            </button>
            </div>
        </div>
      )}
    </div>
  );
}
