import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SYSTEM_MAIL,
    pass: process.env.NODEMAILER_SECRET,
  },
});
const templates = {
  welcome: (name: string) => `
      <p>Hello ${name},</p>
      <p>Welcome to Zporter! We're excited to have you here.</p>
    `,
  booking: (name: string) => `
      <p>Hello ${name},</p>
      <p>Your booking has been confirmed!</p>
    `,
};
export async function sendMail(
  email: string,
  name: string,
  mail_type: "welcome" | "booking"
) {
  try {
    const html = templates[mail_type](name);

    await transporter.sendMail({
      from: `"Zporter" <${process.env.SYSTEM_MAIL}>`,
      to: email,
      subject:
        mail_type === "welcome"
          ? "Welcome to Zporter Arena"
          : "Your Booking Confirmation",
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("Email Error:", error);
    return { success: false, error };
  }
}
