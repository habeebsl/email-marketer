import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { apiService } from "../services/api";
import { LoadingBar } from "../components/LoadingBar";
import type { Template } from "../interfaces";

export function TemplatePage() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [template, setTemplate] = useState<Template>();

  useEffect(() => {
    let mounted = true;

    const fetchTemplate = async () => {
      try {
        const userID = localStorage.getItem("userID");
        const templateID = currentPath.split("/").pop();
        if (userID && templateID) {
          const response = await apiService.getTemplate(templateID, userID);
          if (mounted) {
            setTemplate(response.data);
          }
        }
      } catch (error) {
        if (mounted) {
          console.log("Error fetching project: ", error);
        }
      }
    };

    fetchTemplate();
    return () => {
      mounted = false;
    };
  }, [currentPath]);

  const getProgress = (current: number, total: number) => {
    return total === 0 ? 0 : (current / total) * 100;
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {template && (
          <div className="mt-20 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Sent Card */}
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/40 backdrop-blur-xl rounded-xl p-4 border border-blue-500/20 shadow-xl">
                <div className="flex justify-between items-center mb-3">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-blue-200 uppercase tracking-wider">
                      Total Sent
                    </span>
                    <p className="text-2xl font-bold text-white">
                      {template.total_sent}
                    </p>
                  </div>
                  <div className="bg-blue-500/20 p-3 rounded-lg">
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                  </div>
                </div>
                <LoadingBar
                  progress={getProgress(template.total_sent, 1000)}
                  isIndeterminate={false}
                  color="#60A5FA"
                  height="6px"
                />
              </div>

              {/* Successes Card */}
              <div className="bg-gradient-to-br from-green-900/40 to-green-800/40 backdrop-blur-xl rounded-xl p-4 border border-green-500/20 shadow-xl">
                <div className="flex justify-between items-center mb-3">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-green-200 uppercase tracking-wider">
                      Successes
                    </span>
                    <p className="text-2xl font-bold text-white">
                      {template.successes}
                    </p>
                  </div>
                  <div className="bg-green-500/20 p-3 rounded-lg">
                    <svg
                      className="w-6 h-6 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <LoadingBar
                  progress={getProgress(
                    template.successes,
                    template.total_sent
                  )}
                  isIndeterminate={false}
                  color="#4ADE80"
                  height="6px"
                />
              </div>

              {/* Failures Card */}
              <div className="bg-gradient-to-br from-red-900/40 to-red-800/40 backdrop-blur-xl rounded-xl p-4 border border-red-500/20 shadow-xl">
                <div className="flex justify-between items-center mb-3">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-red-200 uppercase tracking-wider">
                      Failures
                    </span>
                    <p className="text-2xl font-bold text-white">
                      {template.failures}
                    </p>
                  </div>
                  <div className="bg-red-500/20 p-3 rounded-lg">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <LoadingBar
                  progress={getProgress(template.failures, template.total_sent)}
                  isIndeterminate={false}
                  color="#F87171"
                  height="6px"
                />
              </div>
            </div>

            {/* Email Template Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-gray-200/20">
              <div className="p-6 border-b border-gray-700/50 bg-white/5">
                <h2 className="text-xl font-semibold text-white">
                  {template.email_subject}
                </h2>
              </div>
              <div className="p-8 space-y-4">
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300">
                    {template.email_template.split('\n').map((line, index) => (
                        <span key={index}>
                            {line}
                            <br />
                        </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
