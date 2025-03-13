import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";

// User Registration
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

    // Generate a default avatar URL using DiceBear
    const defaultAvatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=YourSeed=${encodeURIComponent(email)}`;
    // Create a new User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      avatar: defaultAvatar, // Save the default avatar URL
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

// User Login
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

// Google Login (handled by Passport.js)
export const googleLogin = async (req: Request, res: Response) => {
  res.json({ message: "Google login successful", user: req.user });
};

// Get All Users
export const getUsers = async (req: Request, res: Response) => {
  try {
    // Fetch users with name, _id, avatar, and email fields
    const users = await User.find({}, 'name _id avatar email');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get User Profile (NEW FUNCTION)
export const getProfile = async (req: Request, res: Response) => {
  try {
    // Fetch the user from the request object (attached by authMiddleware)
    const user = (req as any).user;

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Return the user's profile data, including the email and avatar
    res.json({
      user: {
        name: user.name,
        role: user.role,
        email: user.email,
        avatar: user.avatar, // Ensure avatar is included
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};