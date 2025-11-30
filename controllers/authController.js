import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";

// REGISTER
// REGISTER NEW USER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = await User.create({ name, email, password });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d"
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.status(201).json({ message: "Registered successfully", user: newUser });

  } catch (error) {
    return res.status(500).json({ message: "Registration failed", error });
  }
};


// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Set token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // HTTPS only
      sameSite: "None", // allows mobile/Brave browsers
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      msg: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// GET CURRENT USER
export const getMe = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: "Not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// UPDATE PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const updates = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: updates },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ msg: "User not found" });

    res.json({
      msg: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        ...updates,
      },
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
