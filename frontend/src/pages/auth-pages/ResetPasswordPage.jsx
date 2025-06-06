"use client";

import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle,
} from "lucide-react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const fieldVariants = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  return {
    isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers,
    errors: {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
    },
  };
};

// Simple toast notification
const showToast = (title, description, type = "success") => {
  const toast = document.createElement("div");
  toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
    type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
  }`;
  toast.innerHTML = `
    <div class="font-semibold">${title}</div>
    <div class="text-sm opacity-90">${description}</div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
    }
  }, 4000);
};

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  // Get token from URL params or route params with debugging
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromQuery = urlParams.get("token");
  const tokenFromPath = window.location.pathname.split("/").pop();
  const token = tokenFromQuery || tokenFromPath;

  // Debug logging (remove in production)
  console.log("Current URL:", window.location.href);
  console.log("Token from query:", tokenFromQuery);
  console.log("Token from path:", tokenFromPath);
  console.log("Final token:", token);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate passwords
    const passwordValidation = validatePassword(formData.password);
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordValidation.isValid) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, and numbers";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!token) {
      newErrors.general = "Invalid or expired reset link";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Call your backend API
      const response = await fetch(
        `http://localhost:3000/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: formData.password,
          }),
        }
      );

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      if (data.success) {
        setIsSubmitted(true);
        showToast(
          "Password updated",
          "Your password has been successfully updated!",
          "success"
        );
      } else {
        throw new Error(data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setErrors({
        general:
          error.message ||
          "There was a problem updating your password. Please try again.",
      });
      showToast(
        "Something went wrong",
        error.message ||
          "There was a problem updating your password. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fdf2f8 0%, #eff6ff 50%, #ecfeff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ width: "100%", maxWidth: "28rem" }}
      >
        <motion.div
          variants={itemVariants}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            borderRadius: "24px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            padding: "32px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Header */}
          <motion.div variants={itemVariants} style={{ textAlign: "center" }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              style={{
                width: "64px",
                height: "64px",
                background: "linear-gradient(to right, #3b82f6, #9333ea)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px auto",
              }}
            >
              <KeyRound
                style={{ width: "32px", height: "32px", color: "white" }}
              />
            </motion.div>
            <h1
              style={{
                fontSize: "1.875rem",
                fontWeight: "bold",
                background: "linear-gradient(to right, #111827, #4b5563)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "8px",
              }}
            >
              Reset Password
            </h1>
            <p style={{ color: "#4b5563", fontSize: "0.875rem" }}>
              Enter your new password below
            </p>
          </motion.div>

          {/* Error Message */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "0.875rem",
              }}
            >
              {errors.general}
            </motion.div>
          )}

          {!isSubmitted ? (
            <>
              {/* Form */}
              <motion.form variants={itemVariants} onSubmit={handleSubmit}>
                {/* Password Field */}
                <motion.div
                  variants={fieldVariants}
                  whileHover="hover"
                  style={{ marginBottom: "20px" }}
                >
                  <label
                    htmlFor="password"
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "8px",
                    }}
                  >
                    New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#9ca3af",
                        width: "20px",
                        height: "20px",
                        zIndex: 1,
                      }}
                    />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      disabled={isLoading}
                      required
                      style={{
                        width: "100%",
                        height: "48px",
                        paddingLeft: "40px",
                        paddingRight: "40px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "16px",
                        transition: "all 0.3s ease",
                        outline: "none",
                        backgroundColor: "white",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#3b82f6";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(59, 130, 246, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e5e7eb";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#9ca3af",
                        cursor: "pointer",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {showPassword ? (
                        <EyeOff style={{ width: "20px", height: "20px" }} />
                      ) : (
                        <Eye style={{ width: "20px", height: "20px" }} />
                      )}
                    </motion.button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        color: "#dc2626",
                        fontSize: "0.875rem",
                        marginTop: "4px",
                      }}
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </motion.div>

                {/* Confirm Password Field */}
                <motion.div
                  variants={fieldVariants}
                  whileHover="hover"
                  style={{ marginBottom: "20px" }}
                >
                  <label
                    htmlFor="confirmPassword"
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "8px",
                    }}
                  >
                    Confirm New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#9ca3af",
                        width: "20px",
                        height: "20px",
                        zIndex: 1,
                      }}
                    />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      disabled={isLoading}
                      required
                      style={{
                        width: "100%",
                        height: "48px",
                        paddingLeft: "40px",
                        paddingRight: "40px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "16px",
                        transition: "all 0.3s ease",
                        outline: "none",
                        backgroundColor: "white",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#3b82f6";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(59, 130, 246, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e5e7eb";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <motion.button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#9ca3af",
                        cursor: "pointer",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {showConfirmPassword ? (
                        <EyeOff style={{ width: "20px", height: "20px" }} />
                      ) : (
                        <Eye style={{ width: "20px", height: "20px" }} />
                      )}
                    </motion.button>
                  </div>
                  {errors.confirmPassword && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        color: "#dc2626",
                        fontSize: "0.875rem",
                        marginTop: "4px",
                      }}
                    >
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  variants={itemVariants}
                  style={{ paddingTop: "8px" }}
                >
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <button
                      type="submit"
                      disabled={isLoading}
                      style={{
                        width: "100%",
                        height: "48px",
                        background:
                          "linear-gradient(to right, #2563eb, #9333ea)",
                        color: "white",
                        fontWeight: "500",
                        borderRadius: "12px",
                        border: "none",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        fontSize: "16px",
                        transition: "all 0.3s ease",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        opacity: isLoading ? 0.7 : 1,
                      }}
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                            style={{
                              width: "16px",
                              height: "16px",
                              border: "2px solid white",
                              borderTop: "2px solid transparent",
                              borderRadius: "50%",
                            }}
                          />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound style={{ width: "16px", height: "16px" }} />
                          <span>Update Password</span>
                        </>
                      )}
                    </button>
                  </motion.div>
                </motion.div>
              </motion.form>
            </>
          ) : (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: "center", padding: "16px 0" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                style={{
                  width: "64px",
                  height: "64px",
                  background: "linear-gradient(to right, #10b981, #059669)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px auto",
                }}
              >
                <CheckCircle
                  style={{ width: "32px", height: "32px", color: "white" }}
                />
              </motion.div>
              <div style={{ marginBottom: "16px" }}>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    background: "linear-gradient(to right, #111827, #4b5563)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    marginBottom: "8px",
                  }}
                >
                  Password Updated!
                </h3>
                <p style={{ color: "#4b5563", fontSize: "0.875rem" }}>
                  Your password has been successfully updated. You can now sign
                  in with your new password.
                </p>
              </div>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <a
                  href="/login"
                  style={{
                    display: "inline-block",
                    padding: "12px 24px",
                    background: "linear-gradient(to right, #2563eb, #9333ea)",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "8px",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                  }}
                >
                  Go to Sign In
                </a>
              </motion.div>
            </motion.div>
          )}

          {/* Back to Login Link */}
          <motion.div
            variants={itemVariants}
            style={{
              textAlign: "center",
              borderTop: "1px solid #e5e7eb",
              paddingTop: "24px",
            }}
          >
            <motion.a
              href="/login"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: "0.875rem",
                color: "#4b5563",
                fontWeight: "500",
                textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "#2563eb";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#4b5563";
              }}
            >
              <ArrowLeft
                style={{ marginRight: "8px", width: "16px", height: "16px" }}
              />
              Back to Sign In
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
