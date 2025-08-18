// frontend/src/components/RequireAuth.tsx
import { Navigate, Outlet } from "react-router-dom";

const RequireAuth: React.FC = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
