import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Order Placed Email
export const sendOrderEmail = async (to, orderId, amount) => {
  try {
    await transporter.sendMail({
      from: `"E-Commerce Store" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Order Confirmation",
      html: `
        <h2>Thank you for your order!</h2>
        <p>Your order <strong>#${orderId}</strong> has been placed successfully.</p>
        <p>Total Amount: <strong>₹${amount}</strong></p>
        <p>We will notify you once your order is shipped.</p>
      `,
    });
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};

// ✅ Shipping Email
export const sendShippingEmail = async (to, orderId, status) => {
  try {
    await transporter.sendMail({
      from: `"E-Commerce Store" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Order Status Update",
      html: `
        <h2>Good news!</h2>
        <p>Your order <strong>#${orderId}</strong> status has been updated to: <strong>${status}</strong>.</p>
        <p>Thank you for shopping with us!</p>
      `,
    });
  } catch (error) {
    console.error("❌ Shipping email sending failed:", error);
  }
};
