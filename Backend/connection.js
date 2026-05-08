const { Pool } = require('pg');
require('dotenv').config();

console.log('Conectando a Supabase...');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false,
        require: true
    },
    connectionTimeoutMillis: 30000,  // 30 segundos de timeout
    idleTimeoutMillis: 30000,
    max: 10  // Máximo de conexiones
});

// Manejo de errores del pool
pool.on('error', (err) => {
    console.error('Error inesperado en el pool de conexiones:', err.message);
});

// Probar conexión al iniciar
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error al conectar a Supabase:', err.message);
        console.error('Verifica que las variables de entorno sean correctas');
    } else {
        console.log('Conectado a Supabase PostgreSQL exitosamente');
        release();
    }
});

const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log(`📊 Consulta ejecutada (${duration}ms): ${text.substring(0, 50)}...`);
        return res;
    } catch (error) {
        console.error('Error en consulta:', error.message);
        throw error;
    }
};

module.exports = { query };