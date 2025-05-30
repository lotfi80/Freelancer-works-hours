import { resend } from "./config.js";
import {
  verificationTokenEmailTemplate,
  WELCOME_EMAIL_TEMPLATE,
} from "./email-template.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Verify your email address now",
      html: verificationTokenEmailTemplate(verificationToken),
    });
  } catch (error) {
    console.log("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};
export const sendWelcomeEmail = async (email, name) => {
  try {
    const html = WELCOME_EMAIL_TEMPLATE(name);
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to our company",
      html, // direkt übergeben
    });
    if (error) {
      console.error("Error sending welcome email:", error);
      throw new Error("Failed to send welcome email");
    }
  } catch (error) {
    console.log("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
};
export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Reset your password",
      html: `Click <a href="${resetURL}">here</a> to reset your password.`,
    });

    if (error) {
      console.log("Resend error:", error.message);
      throw new Error("Failed to send email via Resend");
    }

    console.log("Email sent:", data);
  } catch (err) {
    console.log("Error sending password reset email:", err.message);
    throw err;
  }
};
export const sendResetSuccessEmail = async (email) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Password Reset was successfull",
      html: `Your password was reset successfully.`,
    });

    if (error) {
      console.log("Resend error:", error.message);
      throw new Error("Failed to send email via Resend");
    }

    console.log("Email sent:", data);
  } catch (err) {
    console.log("Error sendingpassword reset successfull", err.message);
    throw err;
  }
};
