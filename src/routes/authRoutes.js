// src/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota de Cadastro de Novo Usuário (POST /api/register)
router.post('/register', authController.register);

// Rota de Login de Usuário (POST /api/login)
router.post('/login', authController.login);

module.exports = router;