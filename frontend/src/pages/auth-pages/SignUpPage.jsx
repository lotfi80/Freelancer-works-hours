import { useState } from "react";
// eslint-disable-next-line
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AtSign, User, Mail, Lock, Eye, EyeOff, UserCheck } from "lucide-react";
// import { useUser } from "@/context/userContext";
import { useNavigate } from "react-router-dom";
// import { useUser } from "../context/userContext"; // Adjust the import path as necessary

export default function SignupPage() {
  const apiUrl = "http://localhost:3000/api/auth/signup"; // Update with your actual API URL
  const navigate = useNavigate();
  //   const { user } = useUser(); // Access user context if needed
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    user_name: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    console.log(`${field} changed to:`, value);
    console.log("Current form data:", formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.message || "An error occurred");
      }
      const data = await response.json();
      // E-Mail im localStorage speichern
      localStorage.setItem("verification_email", formData.email);
      // Oder als Query-Parameter übergeben
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`); // Redirect to login page after successful signup
      console.log(data);
      // You can handle the successful signup here, e.g., redirect or show a message
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Signup failed: " + error.message);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-6 border border-white/20"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto"
            >
              <UserCheck className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Create Your Account
            </h1>
            <p className="text-gray-600">
              Join our community and get started today
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Username Field */}
            <motion.div
              variants={fieldVariants}
              whileHover="hover"
              className="space-y-2"
            >
              <Label
                htmlFor="user_name"
                className="text-sm font-medium text-gray-700"
              >
                Username
              </Label>
              <div className="relative group">
                <div>
                  <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-blue-500 transition-colors duration-200" />
                </div>
                <Input
                  id="user_name"
                  type="text"
                  placeholder="Choose a username"
                  value={formData.user_name}
                  onChange={(e) =>
                    handleInputChange("user_name", e.target.value)
                  }
                  className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 group-hover:border-blue-300"
                  required
                />
              </div>
            </motion.div>

            {/* First Name and Last Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name Field */}
              <motion.div
                variants={fieldVariants}
                whileHover="hover"
                className="space-y-2"
              >
                <Label
                  htmlFor="first_name"
                  className="text-sm font-medium text-gray-700"
                >
                  First Name
                </Label>
                <div className="relative group">
                  <div>
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-blue-500 transition-colors duration-200" />
                  </div>
                  <Input
                    id="first_name"
                    type="text"
                    placeholder="First name"
                    value={formData.first_name}
                    onChange={(e) =>
                      handleInputChange("first_name", e.target.value)
                    }
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 group-hover:border-blue-300"
                    required
                  />
                </div>
              </motion.div>

              {/* Last Name Field */}
              <motion.div
                variants={fieldVariants}
                whileHover="hover"
                className="space-y-2"
              >
                <Label
                  htmlFor="last_name"
                  className="text-sm font-medium text-gray-700"
                >
                  Last Name
                </Label>
                <div className="relative group">
                  <div>
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-blue-500 transition-colors duration-200" />
                  </div>
                  <Input
                    id="last_name"
                    type="text"
                    placeholder="Last name"
                    value={formData.last_name}
                    onChange={(e) =>
                      handleInputChange("last_name", e.target.value)
                    }
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 group-hover:border-blue-300"
                    required
                  />
                </div>
              </motion.div>
            </div>

            {/* Email Field */}
            <motion.div
              variants={fieldVariants}
              whileHover="hover"
              className="space-y-2"
            >
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </Label>
              <div className="relative group">
                <div>
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-blue-500 transition-colors duration-200" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 group-hover:border-blue-300"
                  required
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              variants={fieldVariants}
              whileHover="hover"
              className="space-y-2"
            >
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="relative group">
                <div>
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-hover:text-blue-500 transition-colors duration-200" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 group-hover:border-blue-300"
                  required
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants} className="pt-4">
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg"
                >
                  Create Account
                </Button>
              </motion.div>
            </motion.div>
          </motion.form>

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className="text-center text-sm text-gray-600"
          >
            Already have an account?{" "}
            <motion.a
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Sign in here
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
