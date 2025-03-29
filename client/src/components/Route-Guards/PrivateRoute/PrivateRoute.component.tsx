import { Navigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectPath?: string;
}

export default function PrivateRoute({
  children,
  requireAdmin = false,
  redirectPath = "/login",
}: PrivateRouteProps) {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  if (requireAdmin && user.userRole !== "administrator") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
