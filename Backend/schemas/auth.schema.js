const { z } = require('zod');

const loginSchema = z.object({
    nombre_completo: z.string({
        required_error: "El nombre completo es obligatorio",
        invalid_type_error: "El nombre completo debe ser una cadena de texto"
    })
    .min(1, "El nombre completo no puede estar vacío")
    .transform(val => val.toUpperCase().replace(/\s/g, '')),
    password: z.string({
        required_error: "La contraseña es obligatoria"
    }).min(1, "La contraseña no puede estar vacía")
});

const registerSchema = z.object({
    nombre: z.string({
        required_error: "El nombre es obligatorio"
    }).min(1, "El nombre no puede estar vacío"),
    apellidos: z.string({
        required_error: "Los apellidos son obligatorios"
    }).min(1, "Los apellidos no pueden estar vacíos"),
    id_carrera: z.number({
        required_error: "La carrera es obligatoria",
        invalid_type_error: "id_carrera debe ser un número"
    }).int().positive(),
    id_rol: z.number({
        required_error: "El rol es obligatorio",
        invalid_type_error: "id_rol debe ser un número"
    }).int().positive(),
    password: z.string({
        required_error: "La contraseña es obligatoria"
    }).min(6, "La contraseña debe tener al menos 6 caracteres")
});

module.exports = {
    loginSchema,
    registerSchema
};
