import { useUser } from "../context/userContext";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    // Warten, bis Auth-Zustand geladen ist
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Nicht eingeloggt → Umleiten zur Login-Seite
    return <Navigate to="/login" replace />;
  }

  // Eingeloggt → Kindkomponente rendern
  return children;
};
