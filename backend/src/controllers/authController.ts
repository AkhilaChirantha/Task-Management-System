import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";

export const registration = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if the user is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already registered 😒😒" });
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    // Save the new User
    await newUser.save();

    // Send success response
    res.status(200).json({ message: "User Registration is Successfully 😃😍" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error 😟😟" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User not found 😟😟" });
      return;
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid password 🤬🤬😡" });
      return;
    }

    // Generate JWT token
    const token = generateToken({ userId: user.id.toString(), role: user.role, name: user.name });

    // Send the token to the client
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  // This is handled by Passport.js, so no need for additional logic here
  res.json({ message: "Google login successful", user: req.user });
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, 'name _id');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};