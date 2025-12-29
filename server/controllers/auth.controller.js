import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import db from '../config/db.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    // console.log("🔹 RECEIVED CREDENTIAL:", credential);
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
    // console.log("🔹 USER FROM DB:", user);
    // console.log("🔹 ROLE TYPE:", typeof user.role);
    // console.log("🔹 ROLE VALUE:", user.role);
    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Authentication failed' });
  }
};
