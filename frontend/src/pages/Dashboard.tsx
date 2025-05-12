import { ProjectSection } from "../components/ProjectSection"

export function DashboardPage () {
    return (
      <div className="mt-40 mx-auto max-w-4xl px-4">
        <h1 className="text-[white] text-5xl font-bold tracking-tight animate-fade-in">
          Hello, {" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600  bg-clip-text text-transparent animate-gradient">
            {localStorage.getItem("name")}
          </span>
          <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="mt-4 text-lg text-gray-400 leading-relaxed">
          Welcome to your dashboard.
        </p>

        <h2 className="mt-8 mb-4 text-lg font-medium text-blue-600 tracking-tight">
          Projects
        </h2> 
        <ProjectSection />
      </div>
    )
}