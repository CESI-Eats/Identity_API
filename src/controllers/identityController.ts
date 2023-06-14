import { Request, Response } from 'express';
import { Identity, IdentityType } from "../entity/Identity"
import { AppDataSource } from "../data-source"
import { createToken, createRefreshToken, validateRefreshToken, invalidateRefreshToken } from "../services/jwtService";

// Register
export const register = async (req: Request, res: Response) => {
  try {
    const { mail, password, type } = req.body;
    if (!mail || !password || !type) {
      return res.status(400).json({ message: 'Missing mail, password or type' });
    }

    // Check if the user already exists
    let identity = await AppDataSource.manager.findOneBy(Identity, { mail: mail });

    if (identity) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create the new user
    identity = new Identity();
    identity.mail = mail;
    identity.password = password;
    setIdentityType(identity, type)

    // Save the new user
    const newUser = await AppDataSource.manager.save(identity);

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
    if (!mail || !password) {
      return res.status(400).json({ message: 'Missing mail or password' });
    }

    // Check if the user exists
    let identity = await AppDataSource.manager.findOneBy(Identity, { mail: mail });

    if (!identity) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (password != identity.password) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    // Create a JWT token
    const token = createToken(identity.id, identity.type);
    const refreshToken = await createRefreshToken(identity.id);

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
    if (!refreshToken) {
      return res.status(400).json({ message: 'Missing refresh token' });
    }

    // Validate the refresh token
    const identityId = await validateRefreshToken(refreshToken);
    const identity = await AppDataSource.manager.findOneBy(Identity, { id: identityId });

    if (!identityId || !identity) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    // If valid, create a new JWT token
    const token = createToken(identity.id, identity.type);
    const newRefreshToken = await createRefreshToken(identity.id);

    await invalidateRefreshToken(refreshToken);

    res.status(200).json({ token, newRefreshToken});
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
  }
};

function setIdentityType(identity: Identity, type: string): void {
  if (Object.values(IdentityType).includes(type as IdentityType)) {
    identity.type = type as IdentityType;
  } else {
    throw new Error(`Invalid identity type: ${type}`);
  }
}