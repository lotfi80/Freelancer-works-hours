"use client";

import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { ArrowLeft, Mail, KeyRound, CheckCircle } from "lucide-react";

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

// Email validation function
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Simple toast notification
const showToast = (title, description, type = "success") => {
  // Create toast element
  const toast = document.createElement("div");
  toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
    type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
  }`;
  toast.innerHTML = `
    <div class="font-semibold">${title}</div>
    <div class="text-sm opacity-90">${description}</div>
  `;

  document.body.appendChild(toast);

  // Remove after 4 seconds
  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
    }
  }, 4000);
};

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate email
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Here you would integrate with your auth provider to send a reset email
      // For example with Supabase:
      // await supabase.auth.resetPasswordForEmail(email, {
      //   redirectTo: 'http://example.com/account/update-password',
      // })
      const response = await fetch(
        "http://localhost:3000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to send reset link");
      }
      const data = await response.json();
      console.log(data);

      // Simulate API call

      //   await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitted(true);
      showToast(
        "Reset link sent",
        "If an account exists with that email, we've sent a password reset link.",
        "success"
      );
    } catch (error) {
      console.log(error);
      setError("There was a problem sending the reset link. Please try again.");
      showToast(
        "Something went wrong",
        "There was a problem sending the reset link. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(""); // Clear error when user starts typing
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
              Forgot Password?
            </h1>
            <p style={{ color: "#4b5563", fontSize: "0.875rem" }}>
              No worries! Enter your email and we'll send you a reset link
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
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
              {error}
            </motion.div>
          )}

          {!isSubmitted ? (
            <>
              {/* Form */}
              <motion.form variants={itemVariants} onSubmit={handleSubmit}>
                {/* Email Field */}
                <motion.div
                  variants={fieldVariants}
                  whileHover="hover"
                  style={{ marginBottom: "20px" }}
                >
                  <label
                    htmlFor="email"
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "8px",
                    }}
                  >
                    Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail
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
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={handleEmailChange}
                      disabled={isLoading}
                      required
                      style={{
                        width: "100%",
                        height: "48px",
                        paddingLeft: "40px",
                        paddingRight: "12px",
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
                  </div>
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
                          <span>Sending Reset Link...</span>
                        </>
                      ) : (
                        <>
                          <Mail style={{ width: "16px", height: "16px" }} />
                          <span>Send Reset Link</span>
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
                  Check Your Email
                </h3>
                <p style={{ color: "#4b5563", fontSize: "0.875rem" }}>
                  We've sent a password reset link to your email address.
                </p>
              </div>
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <button
                  onClick={() => setIsSubmitted(false)}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    color: "#374151",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "#3b82f6";
                    e.target.style.backgroundColor = "#eff6ff";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.backgroundColor = "white";
                  }}
                >
                  Try Another Email
                </button>
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
