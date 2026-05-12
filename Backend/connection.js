const { Pool } = require('pg');
require('dotenv').config();

// Usar DATABASE_URL para Neon
const connectionString = process.env.DATABASE_URL;

console.log('Conectando a Neon.tech...');

if (!connectionString) {
    console.error('ERROR: DATABASE_URL no está definida en .env');
    process.exit(1);
}

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        require: true,
        rejectUnauthorized: false  // Importante para Neon
    },
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    max: 10
});

// Eventos de conexión
pool.on('connect', () => {
    console.log('Conectado a Neon.tech PostgreSQL exitosamente');
});

pool.on('error', (err) => {
    console.error('Error en el pool de conexiones:', err.message);
});

const query = async (text, params) => {
    try {
        const start = Date.now();
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log(`Consulta (${duration}ms): ${text.substring(0, 60)}...`);
        return res;
    } catch (error) {
        console.error('Error en consulta:', error.message);
        throw error;
    }
};

module.exports = { query, pool };