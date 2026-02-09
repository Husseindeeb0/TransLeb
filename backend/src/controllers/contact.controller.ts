import { Request, Response } from "express";
import { sendContactEmail } from "../config/nodemailer";

const contactUs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
      return;
    }

    // Send Emails via Nodemailer
    await sendContactEmail(name, email, subject, message);

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error: any) {
    console.error("Contact Form Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
};

export { contactUs };
