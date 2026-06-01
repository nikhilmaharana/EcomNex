import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const roleHome = {
  buyer: "/home",
  seller: "/seller",
  admin: "/admin",
};

const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = "/login" }) => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const isLoggedIn = Boolean(user?._id);

  if (!isLoggedIn) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={roleHome[user.role] || "/"} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
