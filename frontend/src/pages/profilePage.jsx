// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import { useUser } from "../context/userContext";
// import { LogoutButton } from "./auth-pages/LogoutButton";

// const ProfilePage = () => {
//   const { user, isAuthenticated, isLoading } = useUser();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       navigate("/login");
//     }
//   }, [isLoading, isAuthenticated, navigate]);

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
//       <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mt-10">
//         <div className="flex justify-end">
//           <LogoutButton />
//         </div>

//         <h1 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h1>

//         <div className="space-y-4">
//           <div className="flex items-center space-x-4">
//             <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
//               {user.first_name?.charAt(0)}
//               {user.last_name?.charAt(0)}
//             </div>
//             <div>
//               <h2 className="text-2xl font-semibold text-gray-800">
//                 {user.first_name} {user.last_name}
//               </h2>
//               <p className="text-gray-600">@{user.user_name}</p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
//             <div className="space-y-2">
//               <p className="text-sm text-gray-500">Username</p>
//               <p className="font-medium text-gray-800">{user.user_name}</p>
//             </div>
//             <div className="space-y-2">
//               <p className="text-sm text-gray-500">Email</p>
//               <p className="font-medium text-gray-800">{user.email}</p>
//             </div>
//             <div className="space-y-2">
//               <p className="text-sm text-gray-500">First Name</p>
//               <p className="font-medium text-gray-800">{user.first_name}</p>
//             </div>
//             <div className="space-y-2">
//               <p className="text-sm text-gray-500">Last Name</p>
//               <p className="font-medium text-gray-800">{user.last_name}</p>
//             </div>
//             <div className="space-y-2">
//               <p className="text-sm text-gray-500">Birth Date</p>
//               <p className="font-medium text-gray-800">
//                 {user.birth_date
//                   ? new Date(user.birth_date).toLocaleDateString()
//                   : "Not provided"}
//               </p>
//             </div>
//           </div>

//           <div className="border-t border-gray-200 pt-6 mt-6">
//             <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//               Edit Profile
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "../context/userContext";
// import { LogoutButton } from "./auth-pages/LogoutButton";

// import { useNavigate, useState, useEffect } from "react-router-dom";
// import { useUser } from "../context/userContext";
// import SimpleTimeEntryForm from "./simplie-time-entry-form";
// import SimpleTimeEntriesList from "./simple-time-entry-list";
// import { LogoutButton } from "./auth-pages/LogoutButton";

// const ProfilePage = () => {
//   const { setUser, user, isAuthenticated, isLoading } = useUser();
//   const navigate = useNavigate();
//   const [editingField, setEditingField] = useState(null);
//   const [tempValue, setTempValue] = useState("");
//   const [activeTab, setActiveTab] = useState("entries");
//   const [refreshTimeEntries, setRefreshTimeEntries] = useState(false);

//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) navigate("/login");
//   }, [isLoading, isAuthenticated, navigate]);

//   const handleEdit = (field, currentValue) => {
//     setEditingField(field);
//     setTempValue(currentValue);
//   };

//   const handleSave = async () => {
//     if (editingField === null) return;

//     try {
//       const response = await fetch(
//         "http://localhost:3000/api/user/update-profile",
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ [editingField]: tempValue }),
//           credentials: "include",
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

//       if (result.user) {
//         setUser(result.user);
//       }

//       setEditingField(null);
//     } catch (error) {
//       console.error("Update error:", error.message);
//       alert(`Update failed: ${error.message}`);
//     }
//   };

//   const handleCancel = () => {
//     setEditingField(null);
//   };

//   const handleTimeEntrySuccess = () => {
//     setRefreshTimeEntries((prev) => !prev);
//     setActiveTab("entries"); // Switch to entries tab after successful submission
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

//           {/* Custom Tab Navigation */}
//           <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
//             <button
//               onClick={() => setActiveTab("entries")}
//               className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
//                 activeTab === "entries"
//                   ? "bg-white text-gray-900 shadow-sm"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               Time Entries
//             </button>
//             <button
//               onClick={() => setActiveTab("add")}
//               className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
//                 activeTab === "add"
//                   ? "bg-white text-gray-900 shadow-sm"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               Add New Entry
//             </button>
//           </div>

//           {/* Tab Content */}
//           {activeTab === "entries" && (
//             <SimpleTimeEntriesList userId={user._id} key={refreshTimeEntries} />
//           )}

//           {activeTab === "add" && (
//             <SimpleTimeEntryForm
//               userId={user._id}
//               onSuccess={handleTimeEntrySuccess}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "../context/userContext";
// import { LogoutButton } from "./auth-pages/LogoutButton";
// import SimpleTimeEntryForm from "../pages/simplie-time-entry-form";
// import SimpleTimeEntriesList from "../pages/simple-time-entry-list";

// const ProfilePage = () => {
//   const { setUser, user, isAuthenticated, isLoading } = useUser();
//   const navigate = useNavigate();
//   const [editingField, setEditingField] = useState(null);
//   const [tempValue, setTempValue] = useState("");
//   const [activeTab, setActiveTab] = useState("entries");
//   const [refreshTimeEntries, setRefreshTimeEntries] = useState(false);

//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) navigate("/login");
//   }, [isLoading, isAuthenticated, navigate]);

//   const handleEdit = (field, currentValue) => {
//     setEditingField(field);
//     setTempValue(currentValue);
//   };

//   const handleSave = async () => {
//     if (editingField === null) return;

//     try {
//       const response = await fetch(
//         "http://localhost:3000/api/user/update-profile",
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ [editingField]: tempValue }),
//           credentials: "include",
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

//       if (result.user) {
//         setUser(result.user);
//       }

//       setEditingField(null);
//     } catch (error) {
//       console.error("Update error:", error.message);
//       alert(`Update failed: ${error.message}`);
//     }
//   };

//   const handleCancel = () => {
//     setEditingField(null);
//   };

//   const handleTimeEntrySuccess = () => {
//     setRefreshTimeEntries((prev) => !prev);
//     setActiveTab("entries"); // Switch to entries tab after successful submission
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

//           {/* Custom Tab Navigation */}
//           <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
//             <button
//               onClick={() => setActiveTab("entries")}
//               className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
//                 activeTab === "entries"
//                   ? "bg-white text-gray-900 shadow-sm"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               Time Entries
//             </button>
//             <button
//               onClick={() => setActiveTab("add")}
//               className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
//                 activeTab === "add"
//                   ? "bg-white text-gray-900 shadow-sm"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               Add New Entry
//             </button>
//           </div>

//           {/* Tab Content */}
//           {activeTab === "entries" && (
//             <SimpleTimeEntriesList userId={user._id} key={refreshTimeEntries} />
//           )}

//           {activeTab === "add" && (
//             <SimpleTimeEntryForm
//               userId={user._id}
//               onSuccess={handleTimeEntrySuccess}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "../context/userContext";
// import { LogoutButton } from "./auth-pages/LogoutButton";
// import SimpleTimeEntryForm from "../pages/simplie-time-entry-form";
// import SimpleTimeEntriesList from "../pages/simple-time-entry-list";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { LogoutButton } from "./auth-pages/LogoutButton";
import SimpleTimeEntryForm from "../pages/simplie-time-entry-form";
import SimpleTimeEntriesList from "../pages/simple-time-entry-list";

const ProfilePage = () => {
  const { setUser, user, isAuthenticated, isLoading } = useUser();
  const navigate = useNavigate();
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [activeTab, setActiveTab] = useState("entries");
  const [refreshTimeEntries, setRefreshTimeEntries] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/login");
  }, [isLoading, isAuthenticated, navigate]);

  const handleEdit = (field, currentValue) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleSave = async () => {
    if (editingField === null) return;

    try {
      const response = await fetch(
        "http://localhost:3000/api/user/update-profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ [editingField]: tempValue }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Update failed");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Update failed");
      }

      if (result.user) {
        setUser(result.user);
      }

      setEditingField(null);
    } catch (error) {
      console.error("Update error:", error.message);
      alert(`Update failed: ${error.message}`);
    }
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  const handleTimeEntrySuccess = () => {
    setRefreshTimeEntries((prev) => !prev);
    setActiveTab("entries"); // Switch to entries tab after successful submission
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading user profile...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mt-10 mb-6">
          <div className="flex justify-end">
            <LogoutButton />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            User Profile
          </h1>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.first_name?.charAt(0)}
                {user.last_name?.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-gray-600">@{user.user_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Username */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Username</p>
                {editingField === "user_name" ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="border rounded px-2 py-1 flex-1"
                    />
                    <button onClick={handleSave} className="text-blue-600 px-2">
                      ✔️
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-red-600 px-2"
                    >
                      ✖️
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-800">
                      {user.user_name}
                    </p>
                    <button
                      onClick={() => handleEdit("user_name", user.user_name)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500">First Name</p>
                {editingField === "first_name" ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="border rounded px-2 py-1 flex-1"
                    />
                    <button onClick={handleSave} className="text-blue-600 px-2">
                      ✔️
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-red-600 px-2"
                    >
                      ✖️
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-800">
                      {user.first_name}
                    </p>
                    <button
                      onClick={() => handleEdit("first_name", user.first_name)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Last Name</p>
                {editingField === "last_name" ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="border rounded px-2 py-1 flex-1"
                    />
                    <button onClick={handleSave} className="text-blue-600 px-2">
                      ✔️
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-red-600 px-2"
                    >
                      ✖️
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-800">
                      {user.last_name}
                    </p>
                    <button
                      onClick={() => handleEdit("last_name", user.last_name)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>

              {/* Birth Date */}
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Birth Date</p>
                {editingField === "birth_date" ? (
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="border rounded px-2 py-1 flex-1"
                    />
                    <button onClick={handleSave} className="text-blue-600 px-2">
                      ✔️
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-red-600 px-2"
                    >
                      ✖️
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-800">
                      {user.birth_date
                        ? new Date(user.birth_date).toLocaleDateString()
                        : "Not provided"}
                    </p>
                    <button
                      onClick={() => handleEdit("birth_date", user.birth_date)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Time Entries Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Time Management
          </h2>

          {/* Custom Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
            <button
              onClick={() => setActiveTab("entries")}
              className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "entries"
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              📊 Time Entries
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "add"
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              ➕ Add New Entry
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === "entries" && (
              <div className="animate-fadeIn">
                <SimpleTimeEntriesList
                  userId={user._id}
                  key={refreshTimeEntries}
                />
              </div>
            )}

            {activeTab === "add" && (
              <div className="animate-fadeIn">
                <SimpleTimeEntryForm
                  userId={user._id}
                  onSuccess={handleTimeEntrySuccess}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
