import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'CYBER_SECRET_KEY_998877';

export const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(418).json({ message: 'Access denied. System requires neural validation (token missing).' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied.' });
    }

    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token signature invalid or expired. Neural access revoked.' });
  }
};
