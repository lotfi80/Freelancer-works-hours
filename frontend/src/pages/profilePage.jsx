// import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// import { useUser } from "../context/userContext";
// // import { LogoutButton } from "./LogoutButton";
// import { LogoutButton } from "./LogoutButton";

// const ProfilePage = () => {
//   const { user, isAuthenticated, isLoading } = useUser();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!isLoading) {
//       if (!isAuthenticated || !user) {
//         navigate("/login");
//       }
//     }
//   }, [isLoading, isAuthenticated, user, navigate]);

//   if (isLoading) {
//     return <div>Loading user profile...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-4">
//       <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mt-10">
//         <LogoutButton />
//         <h1 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h1>
//         <div className="space-y-4">
//           <div className="flex items-center space-x-4">
//             <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
//               {user.first_name ? user.first_name.charAt(0) : ""}
//               {user.last_name ? user.last_name.charAt(0) : ""}
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

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "../context/userContext";
import { LogoutButton } from "./LogoutButton";

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

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
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mt-10">
        <div className="flex justify-end">
          <LogoutButton />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h1>

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
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-medium text-gray-800">{user.user_name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{user.email}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">First Name</p>
              <p className="font-medium text-gray-800">{user.first_name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Last Name</p>
              <p className="font-medium text-gray-800">{user.last_name}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
