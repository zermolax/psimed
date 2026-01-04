import bcrypt from 'bcrypt';

/**
 * EXPLANATION: Password Security
 *
 * When someone logs in, we don't compare plain text passwords.
 * Instead:
 * 1. hashPassword(): Takes "password123" → outputs something like "$2b$10$abc123xyz..."
 *    This hash is IRREVERSIBLE (can't go back to "password123")
 * 2. verifyPassword(): Takes "password123" + the hash → compares them
 *    Bcrypt knows how to do this magic comparison without reversing the hash
 *
 * Why? If a hacker steals your database, they can't read the passwords!
 */

const SALT_ROUNDS = 10; // How many times bcrypt scrambles the password (higher = slower + safer)

/**
 * Hash a plain text password
 * @param password - The plain text password to hash
 * @returns Promise with hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Check if a plain text password matches a hash
 * @param password - The plain text password to check
 * @param hash - The hashed password from database
 * @returns Promise with true if matches, false if not
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
