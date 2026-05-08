const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();

// Configuración CORS para permitir peticiones del frontend
app.use(cors({
    origin: ['http://localhost:5173', 'https://tu-frontend.vercel.app', 'https://tu-frontend.onrender.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
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

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Endpoint de prueba
app.get("/api/test-db", async (req, res) => {
    const { query } = require('./connection');
    try {
        const result = await query('SELECT NOW() as time');
        res.json({ success: true, time: result.rows[0].time });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});