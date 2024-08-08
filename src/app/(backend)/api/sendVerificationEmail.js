import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { email, verificationToken } = await request.json();
    console.log("Sending verification email to:", email);
    console.log("Verification token:", verificationToken);

    // Check environment variables
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_CLIENT_ID:", process.env.EMAIL_CLIENT_ID);
    console.log("EMAIL_CLIENT_SECRET:", process.env.EMAIL_CLIENT_SECRET);
    console.log("EMAIL_REFRESH_TOKEN:", process.env.EMAIL_REFRESH_TOKEN);
    console.log("EMAIL_ACCESS_TOKEN:", process.env.EMAIL_ACCESS_TOKEN);
    console.log("BASE_URL:", process.env.NEXTAUTH_URL);

    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN,
        accessToken: process.env.EMAIL_ACCESS_TOKEN,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      text: `Please verify your email by clicking the following link: ${process.env.NEXTAUTH_URL}/verify?token=${verificationToken}`,
      html: `
        <p>Please verify your email by clicking the following link:</p>
        <a href="${process.env.NEXTAUTH_URL}/verify?token=${verificationToken}">Verify Email</a>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");

    return NextResponse.json(
      { message: "Verification email sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending verification email:", error);
    console.error("Error details:", error.response);

    return NextResponse.json(
      { message: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    return POST(req, res);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
