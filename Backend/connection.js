const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: {
        rejectUnauthorized: false // Necesario para Supabase
    }
});

// Probar la conexión
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error al conectar a Supabase:', err.stack);
    } else {
        console.log('Conectado a Supabase PostgreSQL');
        release();
    }
});

const query = async (text, params) => {
    try {
        const res = await pool.query(text, params);
        return res;
    } catch (error) {
        console.error("Error en la consulta:", error);
        throw error;
    }
};

module.exports = { query };