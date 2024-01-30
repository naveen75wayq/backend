import { Request, Response } from "express"
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve('src/.env') })


export async function signIn(req: Request, res: Response) {
    try {
        const cookies = req.cookies
        const { email, password } = req.body;

        // Validate user input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            // Successfully signed in

            // token 
            const token = jwt.sign(
                { id: user._id, username: user.username },
                process.env.JWT_TOKEN as string,
                { expiresIn: '10s' }
            );
            // refresh token
            const newRefreshToken = jwt.sign(
                { id: user._id, username: user.username },
                process.env.JWT_REFRESH_TOKEN as string,
                { expiresIn: '15s' }
            );

            let newRefreshTokenArray =
                !cookies?.jwt
                    ? user.refreshToken
                    : user.refreshToken.filter(rt => rt !== cookies.jwt);
                //console.log(newRefreshTokenArray);
            if (cookies?.jwt) {

                /* 
                Scenario added here: 
                    1) User logs in but never uses RT and does not logout 
                    2) RT is stolen
                    3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
                */
                const refreshToken = cookies.jwt;
                const foundToken = await User.findOne({ refreshToken }).exec();

                // Detected refresh token reuse!
                if (!foundToken) {
                    // clear out ALL previous refresh tokens
                    newRefreshTokenArray = [];
                }

                res.clearCookie('jwt', 
                { httpOnly: true, 
                    // secure: true 
                });
            }


            // Saving refreshToken with current user
            user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = await user.save();
            //console.log(result);
            // Creates Secure Cookie with refresh token
            res.cookie('jwt', newRefreshToken, { httpOnly: true, 
                // secure: true, 
                // sameSite: 'none', 
                maxAge: 24 * 60 * 60 * 1000 });

            // Send authorization roles and access token to user
           res.json({token})
        } else {
            // Authentication failed
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
