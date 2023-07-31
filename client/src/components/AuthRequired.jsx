import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { logOut } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
const AuthRequired = ({ allowedRoles }) => {
  const location = useLocation();
  const { roles } = useAuthUser();
  const dispatch = useDispatch();

  if (!roles.some((role) => allowedRoles.includes(role))) {
    dispatch(logOut());
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

export default AuthRequired;
