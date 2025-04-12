import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { buyerEmail, orderId, status, url } = await req.json();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email to buyer
    await transporter.sendMail({
      from: `"Artistycode Studio"`,
      to: buyerEmail,
      subject: `Your Order Status Update - Order #${orderId}`,
      html: `
        <div style="background-color:#f9f9f9;padding:40px 20px;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.08);">
            <div style="background-color:#000319;padding:24px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;">Artistycode Studio</h1>
            </div>
            <div style="padding:24px;">
              <p style="font-size:16px;color:#333;margin:0 0 12px;">Hi,</p>
              <p style="font-size:16px;color:#333;margin:0 0 12px;">Your order status has been updated to <strong>${status}</strong>.</p>
              <p style="font-size:16px;color:#333;margin:0 0 12px;">You can view your purchased product and download by visiting the product page.</p>
              <a href="${url}" style="display:inline-block;padding:12px 20px;background-color:#000319;color:#fff;text-decoration:none;border-radius:4px;margin-top:20px;">View Product</a>
            </div>
            <div style="background:#f1f1f1;padding:16px;text-align:center;font-size:12px;color:#777;">
              <p style="margin:0;">&copy; ${new Date().getFullYear()} Artistycode Studio. All rights reserved.</p>
              <a href="https://artistycode.studio" style="color:#555;text-decoration:none;">www.artistycode.studio</a>
            </div>
          </div>
        </div>
      `,
    });

    return new Response("Email sent successfully.", { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response("Failed to send email.", { status: 500 });
  }
}
