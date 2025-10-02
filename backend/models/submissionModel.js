// Define query functions with CRUD operations for submissions table

const pool = require('../config/db');

// CREATE
exports.createSubmission = async ({ name, email, city, country_code, message }) => {
    const [result] = await pool.query(
        `INSERT INTO form_submissions (name, email, city, country_code, message) VALUES (?, ?, ?, ?, ?)`,
        [name, email, city, country_code, message]
    );
    const [rows] = await pool.query(
        `SELECT * FROM form_submissions WHERE id = ?`,
        [result.insertId]   
    );
    return rows[0];
};

// READ (all)

exports.getAll = async (limit = 50, offset = 0) => {
    const [rows] = await pool.execute(`SELECT * FROM form_submissions 
        ORDER BY created_at DESC
         LIMIT ? OFFSET ?`, [Number(limit), Number(offset)]);
    return rows;
};

// READ (by id)
exports.getById = async (id) => {
    const [rows] = await pool.execute(`SELECT * FROM form_submissions WHERE id = ?`, [id]
    );
    return rows[0] || null;
};

// UPDATE (set reviewed)
exports.setReviewed = async (id, reviewed = 1) => {
    await pool.execute(`UPDATE form_submissions SET reviewed=? WHERE id = ?`, [reviewed, id]);
    const [rows] = await pool.execute(`SELECT * FROM form_submissions WHERE id = ?`, [id]);
    return rows[0] || null;
};

// DELETE
exports.remove = async (id) => {
    const [result] = await pool.execute(`DELETE FROM  form_submissions WHERE id = ?`, [id]);
    return result.affectedRows > 0;
};


