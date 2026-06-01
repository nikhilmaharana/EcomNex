import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const ensureSecret = () => {
  if (!SECRET) {
    throw new Error("JWT_SECRET is required in the environment configuration.");
  }
};

export const signToken = (payload) => {
  ensureSecret();
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token) => {
  try {
    ensureSecret();
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
};

export default { signToken, verifyToken };
