import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  

  if (!user) return <Navigate to="/login" replace />;

  if (role && !role.toLowerCase().split(",").includes(user.role?.toLowerCase().trim()))
  return <Navigate to="/" replace />;

  return children;
}