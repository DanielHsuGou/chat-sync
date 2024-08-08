import User from "../../../models/user";
import server from "libs/mongodb/server";

export default async function handler(req, res) {
  await server();

  if (req.method === "POST") {
    const { token } = req.query;

    try {
      const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpires: { $gt: new Date() },
      });

      if (!user) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save();

      res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error verifying email" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
