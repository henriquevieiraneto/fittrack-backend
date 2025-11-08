// backend/server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const mysql = require('mysql2/promise'); // Usamos a versão 'promise' para async/await

const dbConfig = require('./src/config/database'); 
const activityRoutes = require('./src/routes/activityRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); 
app.use(bodyParser.json()); 

// Variável global para o pool de conexão
let connectionPool;

// Função para iniciar o pool de conexão
async function initializeDatabase() {
    try {
        connectionPool = mysql.createPool(dbConfig);
        await connectionPool.getConnection(); // Testa a conexão
        console.log('✅ Conexão com MySQL estabelecida com sucesso.');
    } catch (err) {
        console.error('❌ Não foi possível conectar ao banco de dados:', err);
        // Opcional: Terminar o processo se o DB for vital
        // process.exit(1); 
    }
}

// Passa o pool de conexão para as rotas
app.use((req, res, next) => {
    req.pool = connectionPool;
    next();
});

// Rotas da Aplicação
app.use('/api', activityRoutes);

// Inicia o Servidor e o DB
app.listen(PORT, async () => {
    console.log(`🚀 FitTrack API rodando em http://localhost:${PORT}`);
    await initializeDatabase();
});