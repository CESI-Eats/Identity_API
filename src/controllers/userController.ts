import { Request, Response } from 'express';
import { User } from "../entity/User"
import { AppDataSource } from "../data-source"
import { createToken, createRefreshToken, validateRefreshToken, invalidateRefreshToken } from "../services/jwtService";

// Register
export const register = async (req: Request, res: Response) => {
  try {
    const { mail, password } = req.body;

    // Check if the user already exists
    let user = await AppDataSource.manager.findOneBy(User, { mail: mail });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create the new user
    user = new User();
    user.mail = mail;
    user.password = password;

    // Save the new user
    const newUser = await AppDataSource.manager.save(user);

    res.status(201).json(newUser);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(400).json({ message: errMessage });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { mail, password } = req.body;

    // Check if the user exists
    let user = await AppDataSource.manager.findOneBy(User, { mail: mail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (password != user.password) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Create a JWT token
    const token = createToken(String(user.id));
    const refreshToken = await createRefreshToken(String(user.id));

    res.status(200).json({ token, refreshToken });
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
  }
};

//Refresh
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    // Validate the refresh token
    const userId = await validateRefreshToken(refreshToken);

    if (!userId) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // If valid, create a new JWT token
    const token = createToken(userId);
    const newRefreshToken = await createRefreshToken(userId);

    await invalidateRefreshToken(refreshToken);

    res.status(200).json({ token, newRefreshToken});
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
  }
};
