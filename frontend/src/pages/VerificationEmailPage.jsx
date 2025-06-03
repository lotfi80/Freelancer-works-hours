import { useState, useEffect, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Shield, RefreshCw, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { useUser } from "../context/userContext";

export default function VerificationCodePage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState(""); // This would come from your signup process
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  // const { setUser } = useUser();
  useEffect(() => {
    // 1. Aus URL-Parametern lesen
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");

    // 2. Aus localStorage lesen
    const storedEmail = localStorage.getItem("verification_email");

    // 3. Priorisieren: URL-Param > localStorage
    setEmail(emailParam || storedEmail || "");
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCodeChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;

    setCode(newCode);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newCode = [...code];

    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }

    setCode(newCode);

    // Focus the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex((digit) => digit === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : Math.min(nextEmptyIndex, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerifyCode = async () => {
    const fullCode = code.join("");

    if (fullCode.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ code: fullCode, email: email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      if (data.success) {
        console.log("Email verified successfully!");

        navigate("/login");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setError(error.message || "Invalid verification code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError("");

    try {
      // Replace with your actual resend endpoint
      const response = await fetch(
        "http://localhost:3000/api/auth/resend-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email }), // Send the email to resend code
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend code");
      }

      setCountdown(60); // Set cooldown timer to 60 seconds
      setCode(["", "", "", "", "", ""]); // Clear current code
      inputRefs.current[0]?.focus(); // Focus first input
    } catch (error) {
      console.error("Error resending code:", error);
      setError(error.message || "Failed to resend verification code");
    } finally {
      setIsResending(false);
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

  const codeInputVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
    focus: {
      scale: 1.05,
      borderColor: "#3b82f6",
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
    disabled: {
      opacity: 0.7,
      scale: 1,
      boxShadow: "none",
    },
  };

  const isCodeComplete = code.every((digit) => digit !== "");

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
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Enter Verification Code
            </h1>
            <p className="text-gray-600">
              We've sent a 6-digit code to{" "}
              <span className="font-medium text-blue-600">
                <span className="font-medium text-blue-600">
                  {email || "your email"} {/* Fallback falls email leer */}
                </span>{" "}
              </span>
            </p>
          </motion.div>

          {/* Code Input */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex justify-center space-x-3">
              {code.map((digit, index) => (
                <motion.div
                  key={index}
                  variants={codeInputVariants}
                  whileFocus="focus"
                  className="relative"
                >
                  <Input
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 rounded-xl"
                  />
                </motion.div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-red-500 text-sm bg-red-50 p-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}
          </motion.div>

          {/* Verify Button */}
          <motion.div variants={itemVariants} className="pt-2">
            <motion.div
              variants={buttonVariants}
              whileHover={isCodeComplete && !isVerifying ? "hover" : "disabled"}
              whileTap={isCodeComplete && !isVerifying ? "tap" : "disabled"}
              animate={!isCodeComplete || isVerifying ? "disabled" : ""}
            >
              <Button
                onClick={handleVerifyCode}
                disabled={!isCodeComplete || isVerifying}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Verify Code</span>
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>

          {/* Resend Section */}
          <motion.div variants={itemVariants} className="space-y-4 pt-2">
            <div className="text-center">
              <p className="text-gray-500 text-sm">Didn't receive the code?</p>
            </div>

            <motion.div className="flex justify-center">
              <motion.div
                variants={buttonVariants}
                whileHover={countdown === 0 ? "hover" : "disabled"}
                whileTap={countdown === 0 ? "tap" : "disabled"}
                animate={countdown > 0 ? "disabled" : ""}
              >
                <Button
                  onClick={handleResendCode}
                  disabled={countdown > 0 || isResending}
                  variant="outline"
                  className="px-6 h-10 border-2 border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 font-medium rounded-xl transition-all duration-300 flex items-center space-x-2"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : countdown > 0 ? (
                    <>
                      <Mail className="h-4 w-4" />
                      <span>Resend in {countdown}s</span>
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      <span>Resend Code</span>
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className="text-center text-sm text-gray-600 pt-2"
          >
            <motion.a
              href="/signup"
              className="text-blue-600 hover:text-blue-700 font-medium"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Back to signup
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
