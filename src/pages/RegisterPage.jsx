import { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'PATIENT'
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            alert('Registro exitoso. Ahora inicia sesión.');
            navigate('/'); // Redirigir al login
        } catch (error) {
            alert('Error en el registro. Intenta con otro email.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Crear Cuenta</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <input name="name" placeholder="Nombre completo" className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <input name="email" type="email" placeholder="Email" className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <input name="password" type="password" placeholder="Contraseña (min 6 chars)" className="form-control" onChange={handleChange} required />
                </div>
                <select name="role" className="form-select mb-3" onChange={handleChange}>
                    <option value="PATIENT">Paciente</option>
                    <option value="DOCTOR">Doctor</option>
                </select>
                <button type="submit" className="btn btn-success">Registrarse</button>
            </form>
        </div>
    );
}

export default RegisterPage;