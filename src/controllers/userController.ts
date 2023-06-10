import { Request, Response } from 'express';
import { User } from "../entity/User"
import { AppDataSource } from "../data-source"

// Get all
export const getAllMyModels = async (req: Request, res: Response) => {
  try {
    const identities = await AppDataSource.manager.find(User)
    res.status(200).json(identities);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
  }
};

// Get specific one
export const getMyModel = async (req: Request, res: Response) => {
  try {
    const user = await AppDataSource.manager.findOneBy(User, {id: Number(req.params.id)})
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
    res.status(200).json(user);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(500).json({ message: errMessage });
  }
};

// Create
export const createMyModel = async (req: Request, res: Response) => {
  const user = new User()
    user.mail = req.body.mail;
    user.password = req.body.password;
  try {
    const newUser = await AppDataSource.manager.save(user);
    res.status(201).json(newUser);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'An error occurred';
    res.status(400).json({ message: errMessage });
  }
};