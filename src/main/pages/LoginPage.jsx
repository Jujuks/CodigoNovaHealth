import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importamos Link para la navegación
import api from '../api/axiosConfig';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // 1. Petición al Backend
            const response = await api.post('/auth/login', { email, password });
            
            // 2. Guardar el Token en el navegador
            localStorage.setItem('jwt_token', response.data.token);
            
            // 3. Redirigir al Dashboard
            alert('Login Exitoso');
            navigate('/dashboard');
            
        } catch (error) {
            console.error(error);
            alert('Error: Credenciales incorrectas o problema de conexión');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Iniciar Sesión</h2>
                            
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label className="form-label">Correo Electrónico</label>
                                    <input 
                                        type="email" 
                                        className="form-control"
                                        placeholder="ejemplo@correo.com" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label className="form-label">Contraseña</label>
                                    <input 
                                        type="password" 
                                        className="form-control"
                                        placeholder="******" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary">Ingresar</button>
                                </div>
                            </form>

                            {/* Aquí está el arreglo: Enlace para ir al registro */}
                            <div className="mt-3 text-center">
                                <p>¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;