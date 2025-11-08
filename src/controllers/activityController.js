// backend/src/controllers/activityController.js

exports.createActivity = async (req, res) => {
    const pool = req.pool; // Acessa o pool do middleware
    
    // Simula user_id e coleta dados do frontend
    const user_id = 1; 
    const { activity_type, distance_km, duration_min, perceived_effort, equipment_used } = req.body;

    // Conversão de tipos e validação básica
    const dist = parseFloat(distance_km);
    const duration = parseInt(duration_min);

    if (dist <= 0 || duration <= 0) {
        return res.status(400).json({ error: "Distância e Duração devem ser maiores que zero." });
    }

    // 1. Lógica de Negócio: Calcular o Pace (Ritmo)
    const pace_min_per_km = (duration / dist).toFixed(2); 

    // 2. Lógica de Negócio: Calcular Calorias (Exemplo simplificado)
    // Usando um fator MET simplificado (ex: 80 kcal por km de corrida)
    const calories_burned = Math.round(dist * 80); 
    
    try {
        // 3. Query de Inserção no DB
        const query = `
            INSERT INTO Activities 
            (user_id, activity_type, distance_km, duration_min, calories_burned, pace_min_per_km, perceived_effort, equipment_used)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(query, [
            user_id,
            activity_type,
            dist,
            duration,
            calories_burned,
            pace_min_per_km,
            perceived_effort || null, // Permite que seja nulo
            equipment_used || null
        ]);

        res.status(201).json({ 
            message: "Atividade registrada com sucesso!", 
            activity_id: result.insertId,
            pace_calculated: pace_min_per_km,
            estimated_calories: calories_burned
        });

    } catch (error) {
        console.error("Erro ao criar atividade:", error);
        res.status(500).json({ error: "Falha interna no servidor ao salvar atividade." });
    }
};

exports.getUserActivities = async (req, res) => {
    const pool = req.pool;
    const { userId } = req.params;

    try {
        const query = `
            SELECT * FROM Activities 
            WHERE user_id = ?
            ORDER BY activity_date DESC
        `;
        
        const [rows] = await pool.execute(query, [userId]);
        
        res.status(200).json(rows);
    } catch (error) {
        console.error("Erro ao buscar atividades:", error);
        res.status(500).json({ error: "Falha interna ao buscar histórico." });
    }
};