
import { Request, Response } from 'express';
import { User } from '../models/user.model';

export const createUser = async (req: Request, res: Response) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const authenticateUser = async (req: Request, res: Response) => {
    try {
        const { login, password } = req.body;
        // Simple check - in production use hashing!
        const user = await User.findOne({
            $or: [{ name: login }, { email: login }],
            password: password
        });

        if (user) {
            const payload = JSON.stringify({
                userId: user._id,
                name: user.name,
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24h
            });
            // Simple base64url encoding (approximate)
            const base64Payload = Buffer.from(payload).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
            const header = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
            const signature = 'dummySignature';
            const token = `${header}.${base64Payload}.${signature}`;

            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Authentication failed' });
    }
};

export const logoutUser = (req: Request, res: Response) => {
    res.status(200).send();
};
