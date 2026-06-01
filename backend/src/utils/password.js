import crypto from "crypto";

const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
    .toString("hex");

  return `${salt}:${hash}`;
};

export const verifyPassword = (password, storedPassword) => {
  const [salt, hash] = storedPassword.split(":");
  if (!salt || !hash) return false;

  const candidate = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
    .toString("hex");

  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(candidate));
};
