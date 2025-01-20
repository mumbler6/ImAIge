import { Request, Response, NextFunction } from 'express';
import { auth } from 'firebase-admin';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers.authorization?.split(" ")[1];
    if (!authToken)
        return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decodedToken = await auth().verifyIdToken(authToken);
        req.user = decodedToken;
    }
    catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
}