import { Navigate } from "react-router";
import { useAuth } from "../../types/AuthContext";

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { state } = useAuth();

  return state.token && state.user.isConfirm ? (
    <Navigate to="/balance" />
  ) : (
    <>{children}</>
  );
};

export default AuthRoute;
