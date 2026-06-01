import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const roleHome = {
  buyer: "/home",
  seller: "/seller",
  admin: "/admin",
};

const PublicRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  const isLoggedIn = Boolean(user?._id);

  if (isLoggedIn) {
    const redirect = roleHome[user.role] || "/home";
    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default PublicRoute;
