
import { Request, Response } from 'express';
import { User, IUser } from '../models/user.model';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const createUser = async (req: Request, res: Response) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();

        // Return user without password
        const userObj = savedUser.toObject();
        // @ts-ignore
        delete userObj.password;

        res.json(userObj);
    } catch (err: any) {
        if (err.code === 11000) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const authenticateUser = async (req: Request, res: Response) => {
    try {
        const { login, password } = req.body;

        const user = await User.findOne({
            $or: [{ name: login }, { email: login }]
        });

        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const isMatch = await user.comparePassword(password);

        if (isMatch) {
            const payload = {
                userId: user._id,
                name: user.name,
                email: user.email
            };

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET as string,
                { expiresIn: '24h' }
            );

            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

export const logoutUser = (req: Request, res: Response) => {
    res.status(200).send();
};
