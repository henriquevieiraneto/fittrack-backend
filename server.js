// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const mysql = require('mysql2/promise');
const path = require('path'); 

// Importa as configurações locais e rotas
const dbConfig = require('./src/config/database'); 
const activityRoutes = require('./src/routes/activityRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();
const PORT = 3000;

// Variável para armazenar o pool de conexões MySQL
let connectionPool;

// --- 1. CONFIGURAÇÃO DO BACKEND (API) ---

// Middleware de segurança e processamento de JSON
app.use(cors()); 
app.use(bodyParser.json()); 

// Middleware: Injeta o pool de conexão na requisição
app.use((req, res, next) => {
    req.pool = connectionPool;
    next();
});

// Rotas da Aplicação API 
app.use('/api', authRoutes);     
app.use('/api', activityRoutes); 


// --- 2. CONFIGURAÇÃO DO FRONTEND (Redirecionamento e Arquivos Estáticos) ---

// NOVO POSICIONAMENTO: Esta rota DEVE VIR ANTES de express.static
// Rota padrão (/) MODIFICADA para redirecionar para o Login
app.get('/', (req, res) => {
    // Redireciona o cliente para a URL /login.html
    res.redirect('/login.html'); 
});

// Serve todos os arquivos estáticos da pasta 'public' (CSS, JS, assets, HTML)
// Se não houver uma rota específica acima, ele procura aqui.
app.use(express.static(path.join(__dirname, 'public')));


// --- 3. ROTAS EXPLÍCITAS (Ainda necessárias, mas estáticas) ---

// Rota para a página de Login (para que o redirecionamento funcione)
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rota para a página de Cadastro
app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Rota para a página principal (acessível após login)
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// --- 4. INICIALIZAÇÃO DO SERVIDOR E BANCO DE DADOS ---

async function initializeDatabase() {
    try {
        connectionPool = mysql.createPool(dbConfig);
        await connectionPool.getConnection(); 
        console.log('✅ Conexão com MySQL estabelecida com sucesso.');
    } catch (err) {
        console.error('❌ Não foi possível conectar ao banco de dados:', err.message);
    }
}

// Inicia o Servidor
app.listen(PORT, async () => {
    console.log(`🚀 FitTrack API rodando em http://localhost:${PORT}`);
    await initializeDatabase();
});