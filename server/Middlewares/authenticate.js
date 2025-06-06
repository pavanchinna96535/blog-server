
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Extract token from header
  const token = req.header('Authorization')?.split(" ")[1]; // Format: Bearer <token>
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object
    req.user = {
      id: decoded.id,   // Ensure this matches the token payload
      email: decoded.email
    };

    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    res.status(401).json({ msg: 'Invalid token' });
  }
};

module.exports = authMiddleware;
