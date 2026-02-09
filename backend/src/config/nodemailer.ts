import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export const sendContactEmail = async (
  name: string,
  email: string,
  subject: string,
  message: string,
) => {
  // 1. Email to Support Team (You)
  const mailOptionsToAdmin = {
    from: `"${name}" <${email}>`, // User's name, but sent via your auth email
    to: process.env.EMAIL_USER, // Your support email
    replyTo: email, // So you can reply directly to the user
    subject: `New Contact Form Submission: ${subject}`,
    html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #dc2626;">New Message from TransLeb Contact Form</h2>
          <p>You have received a new message from <strong>${name}</strong>.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
            ${message.replace(/\n/g, "<br>")}
          </div>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #6b7280;">This email was sent from the TransLeb website contact form.</p>
        </div>
      `,
  };

  // 2. Auto-reply Email to User
  const mailOptionsToUser = {
    from: `"TransLeb Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `We received your message: ${subject}`,
    html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #16a34a;">Thank you for contacting TransLeb!</h2>
          <p>Hi ${name},</p>
          <p>We have received your message regarding "<strong>${subject}</strong>" and our team will get back to you as soon as possible.</p>
          <p>Here is a copy of your message:</p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; font-style: italic;">
            "${message.replace(/\n/g, "<br>")}"
          </div>
          <br />
          <p>Best regards,</p>
          <p><strong>The TransLeb Team</strong></p>
          <p style="font-size: 12px; color: #6b7280;"><a href="${process.env.CLIENT_URL}" style="color: #dc2626; text-decoration: none;">www.transleb.com</a></p>
        </div>
      `,
  };

  try {
    await transporter.sendMail(mailOptionsToAdmin);
    await transporter.sendMail(mailOptionsToUser);
    console.log("Contact emails sent successfully");
    return { success: true };
  } catch (error) {
    console.error("Error sending contact emails:", error);
    throw new Error("Failed to send email");
  }
};
