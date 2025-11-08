// frontend/js/app.js

const API_BASE_URL = 'http://localhost:3000/api';
const CURRENT_USER_ID = 1; // ID fixo para demonstração

document.addEventListener('DOMContentLoaded', () => {
    // 1. Carregar o histórico ao iniciar
    loadUserActivities(CURRENT_USER_ID);

    // 2. Configurar o formulário de envio
    const activityForm = document.getElementById('create-activity-form');
    activityForm.addEventListener('submit', handleCreateActivity);

    // 3. Configurar as abas
    const tabs = document.querySelectorAll('.activity-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', handleTabClick);
    });
});

function handleTabClick(event) {
    const tab = event.currentTarget;
    const type = tab.getAttribute('data-type');
    
    // Atualiza a aba ativa no visual
    document.querySelectorAll('.activity-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Atualiza o valor escondido do formulário
    document.getElementById('activity-type-input').value = type;
}


// Função que trata o envio do formulário
async function handleCreateActivity(event) {
    event.preventDefault(); 

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Converte Distância e Duração para number
    data.distance_km = parseFloat(data.distance_km);
    data.duration_min = parseInt(data.duration_min);
    data.perceived_effort = data.perceived_effort ? parseInt(data.perceived_effort) : null;
    
    try {
        const response = await fetch(`${API_BASE_URL}/activities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            alert(`✅ Sucesso! Pace calculado: ${result.pace_calculated} min/km. Calorias estimadas: ${result.estimated_calories}`);
            event.target.reset(); // Limpa o formulário
            loadUserActivities(CURRENT_USER_ID); // Recarrega a lista
        } else {
            alert(`❌ Erro ao registrar: ${result.error || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Erro na comunicação com o servidor:', error);
        alert('❌ Falha na conexão com o FitTrack API. Verifique se o server.js está rodando.');
    }
}

// Função para buscar e exibir as atividades
async function loadUserActivities(userId) {
    const activitiesList = document.getElementById('activities-list');
    activitiesList.innerHTML = '<p class="loading-message">Carregando...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/activities/${userId}`);
        const activities = await response.json();

        if (response.ok && activities.length > 0) {
            activitiesList.innerHTML = ''; // Limpa a mensagem de carregamento
            activities.forEach(activity => {
                activitiesList.innerHTML += createActivityCard(activity);
            });
        } else {
            activitiesList.innerHTML = '<p>Nenhuma atividade registrada ainda.</p>';
        }

    } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        activitiesList.innerHTML = '<p style="color:red;">Falha ao carregar histórico. Conexão perdida.</p>';
    }
}

// Função para criar o HTML de um card de atividade
function createActivityCard(activity) {
    const date = new Date(activity.activity_date).toLocaleDateString('pt-BR');
    const time = new Date(activity.activity_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    return `
        <div class="activity-card">
            <div class="activity-details">
                <div class="detail-item">
                    <span class="detail-value">${activity.activity_type}</span>
                    <p>Tipo</p>
                </div>
                <div class="detail-item">
                    <span class="detail-value">${activity.distance_km} km</span>
                    <p>Distância</p>
                </div>
                <div class="detail-item">
                    <span class="detail-value">${activity.duration_min} min</span>
                    <p>Duração</p>
                </div>
                <div class="detail-item">
                    <span class="detail-value">${activity.calories_burned} kcal</span>
                    <p>Calorias</p>
                </div>
                <div class="detail-item">
                    <span class="detail-value">${activity.pace_min_per_km} min/km</span>
                    <p>Ritmo</p>
                </div>
                <div class="detail-item">
                    <span class="detail-value">${date} às ${time}</span>
                    <p>Data</p>
                </div>
            </div>
        </div>
    `;
}