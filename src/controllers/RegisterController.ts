import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
export async function signUp(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      // Validate user input
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
      }

      // Check if the email is already in use
    const existingUsername = await User.findOne({email}).exec();
    // console.log(existingUsername);
       if(existingUsername) {
        return res.status(409).json({ error: 'Email is already in use' });
      } 
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error('Error during sign-up:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

