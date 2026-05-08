const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();

// Configuración CORS actualizada
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    
    'https://programa-institucional-de-tutorias-pit.onrender.com',
    'https://programa-institucional-de-tutorias-pit-1.onrender.com',
    'https://programa-institucional-de-tutorias-pit.vercel.app',
    'https://*.onrender.com'  // Permitir cualquier subdominio de render
];

app.use(cors({
    origin: function(origin, callback) {
        // Permitir peticiones sin origen (como Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('.onrender.com')) {
            callback(null, true);
        } else {
            console.log('❌ CORS bloqueado para:', origin);
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Manejar preflight requests
app.options('*', cors());

app.use(express.json());

// Importar rutas
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const citasRoutes = require("./routes/citas");

// Endpoints principales
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/citas", citasRoutes);

// Endpoint de prueba
app.get("/api/health", (req, res) => {
    res.json({ 
        status: "OK", 
        message: "Servidor PIT funcionando 🚀",
        timestamp: new Date().toISOString()
    });
});

// Endpoint test DB
app.get("/api/test-db", async (req, res) => {
    const { query } = require('./connection');
    try {
        const result = await query('SELECT NOW() as time');
        res.json({ success: true, time: result.rows[0].time });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Puerto
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});