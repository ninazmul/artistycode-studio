import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { user_name, user_email, phone, message } = await req.json();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email to admin
    await transporter.sendMail({
      from: `"${user_name}" <${user_email}>`,
      to: "contact@artistycode.studio",
      subject: `📩 New Contact Form Submission - ${user_name}`,
      html: `
        <div style="background-color:#f9f9f9;padding:40px 20px;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.08);">
            <div style="background-color:#000319;padding:24px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;">Artistycode Studio</h1>
              <p style="color:#bbbbbb;margin:4px 0 0;font-size:14px;">New Contact Form Submission</p>
            </div>
            <div style="padding:24px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:12px 0;font-weight:bold;width:120px;">Name:</td>
                  <td>${user_name}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0;font-weight:bold;">Email:</td>
                  <td>${user_email}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0;font-weight:bold;">Phone:</td>
                  <td>${phone || "N/A"}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0;font-weight:bold;vertical-align:top;">Message:</td>
                  <td style="white-space:pre-line;">${message}</td>
                </tr>
              </table>
            </div>
            <div style="background:#f1f1f1;padding:16px;text-align:center;font-size:12px;color:#777;">
              <p style="margin:0;">&copy; ${new Date().getFullYear()} Artistycode Studio. All rights reserved.</p>
              <a href="https://artistycode.studio" style="color:#555;text-decoration:none;">www.artistycode.studio</a>
            </div>
          </div>
        </div>
      `,
    });

    // Auto-reply to user
    await transporter.sendMail({
      from: `"Artistycode Studio"`,
      to: user_email,
      subject: `✅ Thanks for contacting us, ${user_name}!`,
      html: `
        <div style="background-color:#f9f9f9;padding:40px 20px;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.08);">
            <div style="background-color:#000319;padding:24px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;">Artistycode Studio</h1>
            </div>
            <div style="padding:24px;">
              <p style="font-size:16px;color:#333;margin:0 0 12px;">Hi ${user_name},</p>
              <p style="font-size:15px;color:#444;margin:0 0 16px;">
                Thank you for reaching out to <strong>Artistycode Studio</strong>. We’ve received your message and our team will get back to you shortly.
              </p>
              <p style="font-size:15px;color:#444;margin:0 0 16px;">
                If your query is urgent, you can also reach us directly at 
                <a href="mailto:contact@artistycode.studio" style="color:#000;text-decoration:underline;">contact@artistycode.studio</a>.
              </p>
              <p style="font-size:15px;color:#444;margin:0 0 16px;">
              Or reach us on WhatsApp: 
              <a href="https://wa.me/8801580845746" target="_blank" style="color:#000;text-decoration:underline;">+880 1580-845746</a>.
              </p>

              <p style="font-size:14px;color:#777;margin:0 0 4px;">Your Submitted Message:</p>
              <blockquote style="margin:0;padding:12px 16px;background-color:#f9f9f9;border-left:4px solid #000319;color:#444;font-style:italic;">
                ${message}
              </blockquote>
              <br />
              <p style="font-size:14px;color:#555;margin-top:24px;">Best regards,<br/>Team Artistycode Studio</p>
            </div>
            <div style="background:#f1f1f1;padding:16px;text-align:center;font-size:12px;color:#777;">
              <p style="margin:0;">&copy; ${new Date().getFullYear()} Artistycode Studio</p>
              <a href="https://artistycode.studio" style="color:#555;text-decoration:none;">www.artistycode.studio</a>
            </div>
          </div>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ message: "Email sent successfully" }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("❌ Email Send Error:", error.message || error);
    return new Response(JSON.stringify({ message: "Failed to send email" }), {
      status: 500,
    });
  }
}
