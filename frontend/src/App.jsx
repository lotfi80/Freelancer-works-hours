import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/auth-pages/SignUpPage";
import { UserProvider } from "./context/userContext";
import VerificationEmailPage from "./pages/auth-pages/VerificationEmailPage";
import LoginPage from "./pages/auth-pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ProfilePage from "./pages/profilePage";
import ForgotPasswordPage from "./pages/auth-pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth-pages/ResetPasswordPage";
import HomePage from "./pages/HomePage";
// import LogoutButton from "./pages/auth-pages/LogoutButton";

function App() {
  return (
    <>
      <div>
        <UserProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-email" element={<VerificationEmailPage />} />
            {/* <Route path="/logout" element={<LogoutButton />} /> */}
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* <Route path="/profile" element={<h1>User Profile Page</h1>} />
          <Route path="/forgot-password" element={<h1>Forgot Password Page</h1>} />
          <Route path="/reset-password/:token" element={<h1>Reset Password Page</h1>} /> */}
          </Routes>
        </UserProvider>
      </div>
    </>
  );
}

export default App;
