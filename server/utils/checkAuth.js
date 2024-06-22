import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'No access' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'key123');
        req.userId = decoded._id;
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(403).json({ message: 'Invalid token' });
    }
};

export default checkAuth;
