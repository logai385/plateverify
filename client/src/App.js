import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { customTheme } from "./customTheme";
import useTitle from "./hooks/useTitle";
import HomePage from "./pages/HomePage";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import NotFound from "./components/NotFound";
import Footer from "./components/Footer";
import RegisterPage from "./features/auth/pages/RegisterPage";
import VerifiedPage from "./features/auth/pages/VerifiedPage";
import LoginPage from "./features/auth/pages/LoginPage";
import Navbar from "./components/Navbar/Index";
import { useSelector } from "react-redux";
import ResendEmailTokenPage from "./features/auth/pages/ResendEmailTokenPage";
import PasswordResetRequestPage from "./features/auth/pages/PasswordResetRequestPage";
import PasswordResetPage from "./features/auth/pages/PasswordResetPage";
import { ROLES } from "./config/roles";
import UsersListPage from "./features/user/pages/UsersListPage";
import DashboardPage from "./pages/DashboardPage";
import AuthRequired from "./components/AuthRequired";
import ProfilePage from "./features/user/pages/ProfilePage";
import EditProfileForm from "./features/user/pages/EditProfileForm";
const App = () => {
  useTitle("Mern Invoice Service");
  const { user } = useSelector((state) => state.auth);
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="auth/verify" element={<VerifiedPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="resend" element={<ResendEmailTokenPage />} />
          <Route
            path="reset_password_request"
            element={<PasswordResetRequestPage />}
          />
          <Route path="auth/reset_password" element={<PasswordResetPage />} />
          {/* Private Routes - Users */}
          <Route
            element={<AuthRequired allowedRoles={[ROLES.User]} />}
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="edit-profile" element={<EditProfileForm />} />
          </Route>
          {/* Private Routes - Admin */}
          <Route element={<AuthRequired allowedRoles={[ROLES.Admin]} />}>
            <Route path="users" element={<UsersListPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Footer />
      <ToastContainer theme="dark" />
    </ThemeProvider>
  );
};
export default App;
