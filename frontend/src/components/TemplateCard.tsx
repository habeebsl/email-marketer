import { LoadingBar } from "./LoadingBar";
import { useNavigationStore } from "../store/useNavigationStore";
import type { Records } from "../interfaces";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface TemplateCardProps {
  email_subject: string; 
  id: string;
  total_sent: number;
  successes: number;
  failures: number;
  performance_records: Records[];
  showIcpPerformance: boolean;
}

export function TemplateCard({ 
  id,
  email_subject, 
  total_sent, 
  successes, 
  failures,
  performance_records,
  showIcpPerformance
}: TemplateCardProps) {
  const navigate = useNavigate()
  const location = useLocation();
  const currentPath = location.pathname;

  const { setPreviousPage } = useNavigationStore()


  const [showAllRecords, setShowAllRecords] = useState(false);

  const getProgress = (current: number, total: number) => {
    return total === 0 ? 0 : (current / total) * 100;
  };

  const sortedRecords = [...performance_records].sort((a, b) => {
    const successRateA = a.total_sent === 0 ? 0 : (a.successes / a.total_sent);
    const successRateB = b.total_sent === 0 ? 0 : (b.successes / b.total_sent);
    
    if (successRateA !== successRateB) {
      return successRateB - successRateA;
    }
    
    return b.total_sent - a.total_sent;
  });

  const displayedRecords = showAllRecords 
    ? sortedRecords 
    : sortedRecords.slice(0, 3);

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setPreviousPage(currentPath)
    navigate(`/template/${id}`)
  }
  
  return (
    <div 
      onClick={handleClick}
      className="relative p-4 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-white w-72 min-h-[480px]"
    >
      {/* Template ID Display */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold tracking-tight">{email_subject.slice(0, 15)}...</h3>
          <div className="h-0.5 w-12 bg-blue-400 mt-1 rounded-full"></div>
        </div>
      </div>

      {/* Stats Container */}
      <div className="space-y-3">
        {/* Total Sent */}
        <div className="bg-blue-900/30 p-2.5 rounded-md">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-blue-200">Total Sent</span>
            <span className="text-xs font-medium text-blue-200">{total_sent}</span>
          </div>
          <LoadingBar
            progress={getProgress(total_sent, 1000)}
            isIndeterminate={false}
            color="#3b82f6"
            height="4px"
          />
        </div>

        {/* Successes */}
        <div className="bg-green-900/30 p-2.5 rounded-md">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-green-200">Successes</span>
            <span className="text-xs font-medium text-green-200">{successes}</span>
          </div>
          <LoadingBar
            progress={getProgress(successes, total_sent)}
            isIndeterminate={false}
            color="#22c55e"
            height="4px"
          />
        </div>

        {/* Failures */}
        <div className="bg-red-900/30 p-2.5 rounded-md">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-red-200">Failures</span>
            <span className="text-xs font-medium text-red-200">{failures}</span>
          </div>
          <LoadingBar
            progress={getProgress(failures, total_sent)}
            isIndeterminate={false}
            color="#ef4444"
            height="4px"
          />
        </div>

        {/* ICP Performance */}
        {showIcpPerformance && <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2 text-gray-200">ICP Performance</h4>
          <div className="space-y-2">
            {displayedRecords.map((record) => (
              <div 
                key={record.id} 
                className="bg-gray-800/30 p-2.5 rounded-md hover:bg-gray-800/40 transition-colors"
                title={`Total Sent: ${record.total_sent}
Successes: ${record.successes}
Failures: ${record.failures}`}
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-medium text-gray-300">{record.subset_name}</span>
                  <span className="text-xs font-medium text-gray-300">
                    {((record.successes / record.total_sent) * 100).toFixed(1)}%
                  </span>
                </div>
                <LoadingBar
                  progress={getProgress(record.successes, record.total_sent)}
                  isIndeterminate={false}
                  color="#60a5fa"
                  height="4px"
                />
              </div>
            ))}
            
            {sortedRecords.length > 3 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllRecords(!showAllRecords);
                }}
                className="w-full mt-1 py-1.5 px-3 text-xs font-medium text-blue-300 
                  bg-blue-900/20 hover:bg-blue-900/30 rounded-md transition-all duration-200
                  border border-blue-500/20 hover:border-blue-500/30 focus:outline-none
                  focus:ring-2 focus:ring-blue-500/20"
              >
                {showAllRecords 
                  ? '− Show Less' 
                  : `+ Show ${sortedRecords.length - 3} More`}
              </button>
            )}
          </div>
        </div>}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -mt-2 -mr-2 h-8 w-8 bg-blue-500 rounded-full opacity-10"></div>
    </div>
  );
}