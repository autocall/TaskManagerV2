import React from "react";
import { Navigate } from "react-router-dom";

interface AuthRouteProps {
    currentUser: object | null | undefined;
    allowAuthenticated: boolean;
    children: React.ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ currentUser, allowAuthenticated, children }) => {
    if (currentUser === undefined) {
        return <div>Loading...</div>;
    }

    if (currentUser === null && allowAuthenticated) {
        return <Navigate to="/login" />;
    }
    if (currentUser !== null && !allowAuthenticated) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};

export default AuthRoute;
