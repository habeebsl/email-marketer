import { Navigate } from "react-router-dom"

type ProtectedRouteProps = {
  isLoggedIn: boolean
  children: React.ReactNode
}

export function ProtectedRoute({ isLoggedIn, children }: ProtectedRouteProps) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}