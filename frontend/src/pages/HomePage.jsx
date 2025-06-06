import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/userContext";
import { LogoutButton } from "./auth-pages/LogoutButton";

const Header = () => {
  const { isAuthenticated, user } = useUser();

  return (
    <header className="fixed top-0 right-0 p-4">
      {isAuthenticated && (
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Hi, {user.first_name}!</span>
          <Link to="/profile" className="text-sm text-blue-500 hover:underline">
            Profile
          </Link>
          <LogoutButton className="text-sm" />
        </div>
      )}
    </header>
  );
};

const HomePage = () => {
  const { isAuthenticated, user, users } = useUser();
  console.log("HomePage users:", users);

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex items-center justify-center min-h-screen">
        {isAuthenticated ? (
          <div className="text-center">
            <div className="text-xl">
              Welcome back, {user.first_name} {user.last_name}! you are logged
              in.
            </div>
            <div>
              <div className="mt-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-gray-600">@{user.user_name}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mt-6">All Users:</h3>
              <ul className="mt-2 space-y-2">
                {users.map((u) => (
                  <li
                    key={u._id || u.id}
                    className="text-gray-700 break-words hover:bg-gray-50 p-2 rounded"
                  >
                    {u.first_name || "No first name"}{" "}
                    {u.last_name || "No last name"}{" "}
                    <span className="text-gray-500">
                      (@{u.user_name || "no_username"})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-xl text-center">
            Welcome to our website! Please{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              log in
            </Link>{" "}
            or{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              sign up
            </Link>
            .
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
