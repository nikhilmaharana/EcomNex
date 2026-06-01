import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import LandingPage from "./LandingPage";

const RootPage = () => {
  const { user } = useContext(UserContext);
  const isLoggedIn = Boolean(user?._id);

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return <LandingPage />;
};

export default RootPage;
