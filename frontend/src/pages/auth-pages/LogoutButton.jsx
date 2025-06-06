// // src/components/LogoutButton.jsx
// import { useUser } from "../context/userContext";
// import { useNavigate } from "react-router-dom";

// export const LogoutButton = () => {
//   const { user, logout } = useUser();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await logout();
//     navigate("/login"); // Weiterleitung nach Logout
//   };

//   if (!user) return null; // Nur anzeigen, wenn eingeloggt

//   return <button onClick={handleLogout}>Logout</button>;
// };
// import { Link } from "react-router-dom";
// import { useUser } from "../context/userContext";

// export const LogoutButton = () => {
//   const { user, logout } = useUser();

//   if (!user) return null;

//   return (
//     <Link
//       to="/login"
//       onClick={async (e) => {
//         e.preventDefault();
//         await logout();
//       }}
//     >
//       Logout
//     </Link>
//   );
// };
import { useUser } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

export const LogoutButton = () => {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
    >
      Logout
    </button>
  );
};
