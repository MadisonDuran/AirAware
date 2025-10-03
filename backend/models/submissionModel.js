// Define query functions with CRUD operations for submissions table

const pool = require('../config/db');

// CREATE
exports.createSubmission = async ({ first_name, last_name, email, country, create_at }) => {
    const [result] = await pool.query(
        `INSERT INTO Newsletter (first_name, last_name, email, country, create_at) VALUES (?, ?, ?, ?, ?)`,
        [first_name, last_name, email, country, create_at]
    );
    const [rows] = await pool.query(
        `SELECT * FROM Newsletter WHERE id = ?`,
        [result.insertId]
    );
    return rows;
};

// READ (all)

exports.getAll = async (limit = 50, offset = 0) => {
    const [rows] = await pool.execute(`SELECT * FROM Newsletter
        ORDER BY created_at DESC`, [limit, offset]
    );
    return rows;
};

// READ (by id)
exports.getById = async (id) => {
    const [rows] = await pool.execute(`SELECT * FROM Newsletter WHERE id = ?`, [id]
    );
    return rows[0] || null;
};

// UPDATE (set reviewed)
exports.setReviewed = async (id, reviewed = 1) => {
    await pool.execute(`UPDATE Newsletter SET reviewed=? WHERE id = ?`, [reviewed, id]);
    const [rows] = await pool.execute(`SELECT * FROM Newsletter WHERE id = ?`, [id]);
    return rows;
};

// DELETE
exports.remove = async (id) => {
    const [result] = await pool.execute(`DELETE FROM Newsletter WHERE id = ?`, [id]);
    return result.affectedRows > 0;
};

