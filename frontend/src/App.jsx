import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignUpPage";
import { UserProvider } from "./context/userContext";
import VerificationEmailPage from "./pages/VerificationEmailPage";
import LoginPage from "./pages/LoginPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ProfilePage from "./pages/profilePage";
function App() {
  return (
    <>
      <div>
        <UserProvider>
          <Routes>
            <Route path="/" element={<h1>Login Page</h1>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-email" element={<VerificationEmailPage />} />
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
