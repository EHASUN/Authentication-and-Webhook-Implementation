import { users } from "../../../data/users";

export default function handler(req, res) {
  const { id } = req.query;
  const user = users.find((u) => u.id === parseInt(id));

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json(user);
}
