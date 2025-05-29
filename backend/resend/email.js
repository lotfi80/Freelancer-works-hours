import { resend } from "./config.js";
import { verificationTokenEmailTemplate } from "./email-template.js";

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
