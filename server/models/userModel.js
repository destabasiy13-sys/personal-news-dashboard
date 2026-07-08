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
    'SELECT id, username, email, created_at FROM users WHERE id = ? LIMIT 1',
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

module.exports = { findByUsernameOrEmail, findByUsername, findById, createUser };
