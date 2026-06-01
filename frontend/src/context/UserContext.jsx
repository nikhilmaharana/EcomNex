import { createContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  saveCurrentUser,
  clearCurrentUser,
} from "../lib/api";

const DEFAULT_USER = {
  name: "",
  email: "",
  phone: "",
  location: "",
  address: "",
  image: "",
  role: "buyer",
};

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => getCurrentUser() || DEFAULT_USER);

  useEffect(() => {
    if (user?._id || user?.id) {
      saveCurrentUser(user);
    } else {
      clearCurrentUser();
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export { UserContext, DEFAULT_USER };
