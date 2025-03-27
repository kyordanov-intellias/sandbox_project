import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

interface AuthRouteProps {
    children: React.ReactNode;
}

export function AuthRoute({ children }: AuthRouteProps) {
    const { user, loading } = useUser();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}