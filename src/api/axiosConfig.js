import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // La dirección de tu Spring Boot
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor: Antes de cada petición, pega el token si existe
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt_token'); // Guardaremos el token aquí
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;