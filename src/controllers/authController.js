// src/controllers/authController.js

const bcrypt = require('bcryptjs'); 

exports.register = async (req, res) => {
    const pool = req.pool;
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    try {
        // 1. Criptografar a Senha
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 2. Inserir no Banco de Dados
        const query = `
            INSERT INTO Users (username, email, password_hash)
            VALUES (?, ?, ?)
        `;
        const [result] = await pool.execute(query, [username, email, password_hash]);

        res.status(201).json({ 
            message: "Usuário registrado com sucesso!",
            userId: result.insertId
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: "Nome de usuário ou email já em uso." });
        }
        console.error("Erro no cadastro:", error);
        res.status(500).json({ error: "Falha interna no servidor ao registrar." });
    }
};

exports.login = async (req, res) => {
    const pool = req.pool;
    const { email, password } = req.body;

    try {
        // 1. Buscar o Usuário
        const [rows] = await pool.execute('SELECT id, password_hash, username FROM Users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ error: "Email ou senha inválidos." });
        }

        // 2. Comparar a Senha
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: "Email ou senha inválidos." });
        }

        // 3. Sucesso: Devolver dados do usuário (em apps reais, aqui seria gerado um JWT)
        res.status(200).json({ 
            message: "Login bem-sucedido!",
            userId: user.id,
            username: user.username
        });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: "Falha interna no servidor ao fazer login." });
    }
};