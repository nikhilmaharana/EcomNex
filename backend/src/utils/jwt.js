import jwt from "jsonwebtoken";

const ensureSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required in the environment configuration.");
  }
};

export const signToken = (payload) => {
  ensureSecret();
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
};

export const verifyToken = (token) => {
  try {
    ensureSecret();
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

export default { signToken, verifyToken };
