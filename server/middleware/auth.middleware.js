import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';

export const authenticate = (req, res, next) => {
  // Try to get token from Authorization header first (current method)
  let token = req.headers.authorization?.split(' ')[1];
  
  // Fallback: check httpOnly cookie
  if (!token && req.cookies && req.cookies.auth_token) {
    token = req.cookies.auth_token;
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // IP binding check - prevent token sharing across devices
    const clientIP = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    if (decoded.ip && decoded.ip !== clientIP) {
      console.error(`[SECURITY] IP mismatch - Token IP: ${decoded.ip}, Request IP: ${clientIP}`);
      return res.status(403).json({ message: 'Token cannot be used from a different device' });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
