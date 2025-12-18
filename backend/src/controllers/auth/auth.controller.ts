import type { Request, Response } from "express";
import { User, UserType } from "../../models/User";
import bcrypt from "bcryptjs";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = Object.values(UserType).includes(role)
      ? role
      : UserType.JobSeeker;
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });
    await user.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
