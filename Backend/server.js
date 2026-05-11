const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();

// Configuración CORS - Permitir ambos dominios de Render
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://programa-institucional-de-tutorias-pit.onrender.com',
    'https://programa-institucional-de-tutorias-pit-1.onrender.com'
];

app.use(cors({
    origin: function(origin, callback) {
        // Permitir peticiones sin origen (como Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS bloqueado para:', origin);
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));


app.use(express.json());

// Importar rutas
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const citasRoutes = require("./routes/citas");
const avisoRoutes = require("./routes/avisoRoutes");

// Endpoints principales
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/citas", citasRoutes);
app.use("/api/avisos", avisoRoutes);

// Endpoint de prueba
app.get("/api/health", (req, res) => {
    res.json({ 
        status: "OK", 
        message: "Servidor PIT funcionando ",
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});