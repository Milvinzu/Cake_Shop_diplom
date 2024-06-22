import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const useUser = () => {
  const user = useSelector((state: RootState) => state.user);
  const isLoggedIn = user && user.token !== null;
  const isAdmin = user && user.role === "admin";

  return { isLoggedIn, isAdmin };
};
