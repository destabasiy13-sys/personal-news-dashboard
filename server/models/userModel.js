const pool = require('../config/db');

async function findByUsernameOrEmail(username, email) {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1',
    [username, email]
  );
  return rows[0];
}

async function findByUsername(username) {
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE username = ? LIMIT 1',
    [username]
  );
  return rows[0];
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, username, email, is_verified, created_at FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0];
}

async function createUser(username, email, passwordHash) {
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
    [username, email, passwordHash]
  );
  return result.insertId;
}

async function findPasswordHashById(id) {
  const [rows] = await pool.query(
    'SELECT password_hash FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0]?.password_hash;
}

async function updateProfile(id, username, email) {
  await pool.query(
    'UPDATE users SET username = ?, email = ? WHERE id = ?',
    [username, email, id]
  );
}

async function updatePassword(id, passwordHash) {
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, id]);
}

async function setVerificationToken(id, token, expiresAt) {
  await pool.query(
    'UPDATE users SET verification_token = ?, verification_token_expires = ? WHERE id = ?',
    [token, expiresAt, id]
  );
}

async function findByVerificationToken(token) {
  const [rows] = await pool.query(
    'SELECT id, verification_token_expires FROM users WHERE verification_token = ? LIMIT 1',
    [token]
  );
  return rows[0];
}

async function markVerified(id) {
  await pool.query(
    'UPDATE users SET is_verified = TRUE, verification_token = NULL, verification_token_expires = NULL WHERE id = ?',
    [id]
  );
}

module.exports = {
  findByUsernameOrEmail,
  findByUsername,
  findById,
  findPasswordHashById,
  createUser,
  updateProfile,
  updatePassword,
  setVerificationToken,
  findByVerificationToken,
  markVerified,
};
