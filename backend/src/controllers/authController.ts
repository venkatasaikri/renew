import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: 'Username already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 });
    res.status(201).json({ message: 'Registered successfully', user: { username: newUser.username } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      // For demo purposes, let's create a default admin if none exists
      if (username === 'admin' && password === 'admin') {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 });
        res.json({ message: 'Logged in successfully', user: { username: newUser.username } });
        return;
      }
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 });
    res.json({ message: 'Logged in successfully', user: { username: user.username } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById((req as any).userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
