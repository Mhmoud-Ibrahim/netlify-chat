import { Navigate, Outlet } from "react-router-dom";
import ChatLoader from "./ChatLoader";
import { SocketContext, type SocketContextValue } from "./SocketContext";
import { useContext } from "react";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const socketContext = useContext(SocketContext);
  if (!socketContext) return null;

  const { user, loading } = socketContext as SocketContextValue;
  if (loading) {
    return <ChatLoader />;
  }
  if (!user) {
    console.log("Access Denied: No User Found");
    return <Navigate to="/login" replace />;
  }
  return children ? <>{children}</> : <Outlet />;
}
