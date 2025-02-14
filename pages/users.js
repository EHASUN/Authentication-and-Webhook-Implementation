import { users } from "../../data/users";
import bcrypt from "bcryptjs";
import { authenticate } from "./middleware/auth";

export default function handler(req, res) {
  if (req.method === "GET") {
    return authenticate(req, res, () => {
      res.status(200).json(users);
    });
  }

  if (req.method === "POST") {
    const { name, email, password } = req.body;

    if (users.find((user) => user.email === email)) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
    };

    users.push(newUser);
    return res.status(201).json({ message: "User created", user: newUser });
  }

  res.status(405).json({ message: "Method not allowed" });
}
