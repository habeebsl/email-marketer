import { TemplateCard } from "./TemplateCard"
import type { Template } from "../interfaces"

interface TemplateSectionProps {
  templates: Template[]
}

export function TemplateSection({ templates }: TemplateSectionProps) {
  if (templates.length === 0) {
    return (
      <div className="w-full">
        <div className="h-[242px] w-72 bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">No templates found</p>
        </div>
      </div>
    )
  }

  const sortedTemplates = [...templates].sort((a, b) => {
    const aRate = a.total_sent > 0 ? a.successes / a.total_sent : 0;
    const bRate = b.total_sent > 0 ? b.successes / b.total_sent : 0;
    return bRate - aRate;
  });

  return (
    <div className="w-full">
      <div className="flex overflow-x-auto no-scrollbar gap-6 py-4 px-2">
        <div className="flex-shrink-0">
          <div className="h-[480px] w-72 bg-slate-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer transition-colors">
            <div className="flex flex-col items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-gray-500">Add Template</span>
            </div>
          </div>
        </div>
        {sortedTemplates.map((template) => (
          <div key={template.id} className="flex-shrink-0">
            <TemplateCard
              email_subject={template.email_subject}
              id={template.id}
              total_sent={template.total_sent}
              successes={template.successes}
              failures={template.failures}
              performance_records={template.performance_records}
              showIcpPerformance={true}
            />
          </div>
        ))}
      </div>
    </div>
  )
}