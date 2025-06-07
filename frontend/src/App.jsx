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
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "./context/userContext";
// import { LogoutButton } from "./pages/auth-pages/LogoutButton";
// import TimeEntryForm from "./pages/simplie-time-entry-form";
// import TimeEntriesList from "./pages/simple-time-entry-list";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// const ProfilePage = () => {
//   const { setUser, user, isAuthenticated, isLoading } = useUser();
//   const navigate = useNavigate();
//   const [editingField, setEditingField] = useState(null);
//   const [tempValue, setTempValue] = useState("");
//   const [refreshTimeEntries, setRefreshTimeEntries] = useState(false);

//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) navigate("/login");
//   }, [isLoading, isAuthenticated, navigate]);

//   const handleEdit = (field, currentValue) => {
//     setEditingField(field);
//     setTempValue(currentValue);
//   };

//   const handleSave = async () => {
//     if (editingField === null) return; // Falls kein Feld bearbeitet wird

//     try {
//       const response = await fetch(
//         "http://localhost:3000/api/user/update-profile",
//         {
//           method: "PATCH", // Besser als PUT für partielle Updates
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ [editingField]: tempValue }),
//           credentials: "include", // Cookies für Authentifizierung
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Update failed");
//       }

//       const result = await response.json();

//       if (!result.success) {
//         throw new Error(result.message || "Update failed");
//       }

//       // Aktualisiere den User-State (falls `useUser` oder ein State-Manager verwendet wird)
//       if (result.user) {
//         setUser(result.user); // Annahme: `setUser` kommt aus deinem User-Context
//       }

//       setEditingField(null); // Edit-Modus beenden
//     } catch (error) {
//       console.error("Update error:", error.message);
//       // Optional: Fehler im UI anzeigen (z. B. mit einem Toast)
//       alert(`Update failed: ${error.message}`);
//     }
//   };

//   const handleCancel = () => {
//     setEditingField(null);
//   };

//   const handleTimeEntrySuccess = () => {
//     setRefreshTimeEntries((prev) => !prev);
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-xl">Loading user profile...</div>
//       </div>
//     );
//   }

//   if (!user) return null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-4">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mt-10 mb-6">
//           <div className="flex justify-end">
//             <LogoutButton />
//           </div>

//           <h1 className="text-3xl font-bold text-gray-800 mb-6">
//             User Profile
//           </h1>

//           <div className="space-y-4">
//             <div className="flex items-center space-x-4">
//               <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
//                 {user.first_name?.charAt(0)}
//                 {user.last_name?.charAt(0)}
//               </div>
//               <div>
//                 <h2 className="text-2xl font-semibold text-gray-800">
//                   {user.first_name} {user.last_name}
//                 </h2>
//                 <p className="text-gray-600">@{user.user_name}</p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
//               {/* Username */}
//               <div className="space-y-2">
//                 <p className="text-sm text-gray-500">Username</p>
//                 {editingField === "user_name" ? (
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={tempValue}
//                       onChange={(e) => setTempValue(e.target.value)}
//                       className="border rounded px-2 py-1"
//                     />
//                     <button onClick={handleSave} className="text-blue-600">
//                       ✔️
//                     </button>
//                     <button onClick={handleCancel} className="text-red-600">
//                       ✖️
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2">
//                     <p className="font-medium text-gray-800">
//                       {user.user_name}
//                     </p>
//                     <button
//                       onClick={() => handleEdit("user_name", user.user_name)}
//                       className="text-sm text-blue-600 hover:underline"
//                     >
//                       Edit
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* First Name */}
//               <div className="space-y-2">
//                 <p className="text-sm text-gray-500">First Name</p>
//                 {editingField === "first_name" ? (
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={tempValue}
//                       onChange={(e) => setTempValue(e.target.value)}
//                       className="border rounded px-2 py-1"
//                     />
//                     <button onClick={handleSave} className="text-blue-600">
//                       ✔️
//                     </button>
//                     <button onClick={handleCancel} className="text-red-600">
//                       ✖️
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2">
//                     <p className="font-medium text-gray-800">
//                       {user.first_name}
//                     </p>
//                     <button
//                       onClick={() => handleEdit("first_name", user.first_name)}
//                       className="text-sm text-blue-600 hover:underline"
//                     >
//                       Edit
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Last Name */}
//               <div className="space-y-2">
//                 <p className="text-sm text-gray-500">Last Name</p>
//                 {editingField === "last_name" ? (
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={tempValue}
//                       onChange={(e) => setTempValue(e.target.value)}
//                       className="border rounded px-2 py-1"
//                     />
//                     <button onClick={handleSave} className="text-blue-600">
//                       ✔️
//                     </button>
//                     <button onClick={handleCancel} className="text-red-600">
//                       ✖️
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2">
//                     <p className="font-medium text-gray-800">
//                       {user.last_name}
//                     </p>
//                     <button
//                       onClick={() => handleEdit("last_name", user.last_name)}
//                       className="text-sm text-blue-600 hover:underline"
//                     >
//                       Edit
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Birth Date */}
//               <div className="space-y-2">
//                 <p className="text-sm text-gray-500">Birth Date</p>
//                 {editingField === "birth_date" ? (
//                   <div className="flex gap-2">
//                     <input
//                       type="date"
//                       value={tempValue}
//                       onChange={(e) => setTempValue(e.target.value)}
//                       className="border rounded px-2 py-1"
//                     />
//                     <button onClick={handleSave} className="text-blue-600">
//                       ✔️
//                     </button>
//                     <button onClick={handleCancel} className="text-red-600">
//                       ✖️
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2">
//                     <p className="font-medium text-gray-800">
//                       {user.birth_date
//                         ? new Date(user.birth_date).toLocaleDateString()
//                         : "Not provided"}
//                     </p>
//                     <button
//                       onClick={() => handleEdit("birth_date", user.birth_date)}
//                       className="text-sm text-blue-600 hover:underline"
//                     >
//                       Edit
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Time Entries Section */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-10">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">
//             Time Management
//           </h2>

//           <Tabs defaultValue="entries" className="w-full">
//             <TabsList className="grid w-full grid-cols-2 mb-6">
//               <TabsTrigger value="entries">Time Entries</TabsTrigger>
//               <TabsTrigger value="add">Add New Entry</TabsTrigger>
//             </TabsList>

//             <TabsContent value="entries">
//               <TimeEntriesList userId={user._id} key={refreshTimeEntries} />
//             </TabsContent>

//             <TabsContent value="add">
//               <TimeEntryForm
//                 userId={user._id}
//                 onSuccess={handleTimeEntrySuccess}
//               />
//             </TabsContent>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
