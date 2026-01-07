import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import db from '../config/db.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: 'No token' });

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email } = ticket.getPayload();

    const [rows] = await db.query(
      `SELECT u.user_id, u.name, u.email, r.role
       FROM users u
       JOIN role r ON u.role_id = r.role_id
       WHERE u.email = ? AND u.is_active = 1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: 'User not authorized' });
    }

    const user = rows[0];
    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Only return token - user data fetched separately via /me endpoint
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Get authenticated user's data
export const getMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.user_id, u.name, u.email, u.ID, u.department, r.role
       FROM users u
       JOIN role r ON u.role_id = r.role_id
       WHERE u.user_id = ? AND u.is_active = 1`,
      [req.user.user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    res.json({
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        ID: user.ID,
        department: user.department
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
};
