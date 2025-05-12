import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigationStore } from "../store/useNavigationStore";

export function NavBar() {
  const navigate = useNavigate()
  const location = useLocation();
  const currentPath = location.pathname;
  const [showCreate, setShowCreate] = useState(false)
  const [showSend, setShowSend] = useState(false)
  const [showSignout, setShowSignout] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showBack, setShowBack] = useState(false)
  const { previousPage, setPreviousPage } = useNavigationStore()

  const handleSignout = () => {
    localStorage.clear()
    setPreviousPage(currentPath)
    navigate("/login")
  }

  const handleCreate = () => {
    setPreviousPage(currentPath)
    navigate("/create")
  }

  const handleBack = () => {
    navigate(previousPage)
  }

  const handleDashboard = () => {
    setPreviousPage(currentPath)
    navigate("/dashboard")
  }

  const handleSend = () => {
    setPreviousPage(currentPath)
    const projectId = currentPath.split('/').pop();
    navigate(`/project/${projectId}/send`)
  }

  useEffect(() => {
    console.log(currentPath)
    const buttonVisibility = {
      'dashboard': {
        create: true,
        dashboard: false,
        send: false,
        back: false,
        login: true
      },
      'project': {
        create: false,
        dashboard: true,
        send: true,
        back: false,
        login: true
      },
      'send': {
        create: false,
        dashboard: true,
        send: false,
        back: true,
        login: true
      },
      'signout': {
        create: false,
        dashboard: false,
        send: false,
        back: false,
        login: false
      },
      'default': {
      create: false,
      dashboard: true,
      send: false,
      back: true,
      login: true
      }
    };

    const getVisibility = () => {
      if (currentPath === '/login' || currentPath === '/signup') {
        return buttonVisibility['signout']
      }
      if (currentPath === '/dashboard') {
      return buttonVisibility['dashboard'];
      }
      if (currentPath.endsWith("/send")) {
        return buttonVisibility['send']
      }
      if (currentPath.startsWith('/project/')) {
      return buttonVisibility['project'];
      }
      return buttonVisibility['default'];
    };

    const visibility = getVisibility();
    setShowCreate(visibility.create);
    setShowDashboard(visibility.dashboard);
    setShowSend(visibility.send);
    setShowBack(visibility.back);
    setShowSignout(visibility.login)
    }, [currentPath])

  useEffect(() => {
    console.log(previousPage)
  }, [previousPage])

  return (
    <nav className="flex justify-between items-center py-13 px-6 fixed top-0 w-full h-15">
      <div>
        {(showBack && previousPage && previousPage !== currentPath) && (
          <button onClick={handleBack} className="px-5 py-3 rounded-[5px] text-white bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800">
            Back
          </button>
        )}
      </div>
      <div className="flex gap-3 items-center">
        {showCreate && (
          <button onClick={handleCreate} className="px-5 py-3 rounded-[5px] text-white bg-amber-500 hover:bg-amber-600 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]">
            Create
          </button>
        )}
        {showDashboard && (
          <button onClick={handleDashboard} className="px-5 py-3 rounded-[5px] text-white bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800">
            Dashboard
          </button>
        )}
        {showSend && (
          <button onClick={handleSend} className="px-5 py-3 rounded-[5px] text-white bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800">
            Send
          </button>
        )}
        {showSignout && (
          <button onClick={handleSignout} className="px-5 py-3 bg-red-700 rounded-[5px] text-white hover:bg-red-800">
          Signout
        </button>
      )}
      </div>
    </nav>
  )
}