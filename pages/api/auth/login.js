import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { users } from "../../../data/users";

const SECRET_KEY = "your_secret_key"; // Use a secure key in production

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Verify password
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: "1h",
  });

  return res.status(200).json({ token });
}
