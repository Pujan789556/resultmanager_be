import jwt from 'jsonwebtoken';
export const checkAuth = (req, res, next) => {
  const token = req.cookies.secret;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const tokenVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!tokenVerified) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};
