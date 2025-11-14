// public/js/auth.js

const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

/**
 * Lida com o envio do formulário de Cadastro.
 */
async function handleRegister(event) {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.target).entries());

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const result = await response.json();

        if (response.ok) {
            alert(`✅ Cadastro realizado! Você já pode fazer login.`);
            // Redireciona para a página de login
            window.location.href = '/login.html'; 
        } else {
            alert(`❌ Erro: ${result.error || 'Falha no cadastro.'}`);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('❌ Erro de conexão com o servidor. Verifique se o backend está ativo.');
    }
}

/**
 * Lida com o envio do formulário de Login.
 */
async function handleLogin(event) {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.target).entries());

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const result = await response.json();

        if (response.ok) {
            alert(`🥳 Bem-vindo, ${result.username}!`);
            
            // Salva o ID do usuário localmente (chave de autenticação simples)
            localStorage.setItem('fittrack_userId', result.userId); 
            
            // CORREÇÃO: Redireciona para a página principal (/index.html)
            window.location.href = '/index.html'; 

        } else {
            alert(`❌ Erro: ${result.error || 'Email ou senha inválidos.'}`);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('❌ Erro de conexão com o servidor. Verifique o backend.');
    }
}