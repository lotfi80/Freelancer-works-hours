import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignUpPage";

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<h1>Login Page</h1>} />
          <Route path="/login" element={<h1>Login Page</h1>} />
          <Route path="/signup" element={<SignupPage />} />
          {/* <Route path="/profile" element={<h1>User Profile Page</h1>} />
          <Route path="/forgot-password" element={<h1>Forgot Password Page</h1>} />
          <Route path="/reset-password/:token" element={<h1>Reset Password Page</h1>} /> */}
        </Routes>
      </div>
    </>
  );
}

export default App;
