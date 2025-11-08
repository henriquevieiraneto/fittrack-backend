// backend/src/routes/activityRoutes.js

const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// Rota para CRIAR uma nova atividade (POST /api/activities)
router.post('/activities', activityController.createActivity);

// Rota para LISTAR atividades (GET /api/activities/1)
router.get('/activities/:userId', activityController.getUserActivities);

module.exports = router;