import { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'PATIENT'
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/register', formData);
            navigate('/'); // Redirigir al login
        } catch (error) {
            console.error(error);
            alert('Error en el registro. El email ya podría estar registrado.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            {/* Background Shapes */}
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>

            <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
                <div className="row w-100 justify-content-center">
                    {/* Left Side - Hero Section */}
                    <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center hero-section">
                        <div className="hero-content text-center">
                            <div className="hero-icon mb-4">
                                <i className="bi bi-person-plus-fill"></i>
                            </div>
                            <h1 className="hero-title mb-3">
                                Únete a <span className="text-primary">Nova</span>Health
                            </h1>
                            <p className="hero-subtitle mb-4">
                                Crea tu cuenta y accede a servicios médicos de calidad desde cualquier lugar.
                            </p>
                            <div className="hero-features">
                                <div className="feature-item">
                                    <i className="bi bi-clock-history"></i>
                                    <span>Registro Rápido</span>
                                </div>
                                <div className="feature-item">
                                    <i className="bi bi-shield-check"></i>
                                    <span>Datos Seguros</span>
                                </div>
                                <div className="feature-item">
                                    <i className="bi bi-heart-pulse"></i>
                                    <span>Atención Personalizada</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Register Form */}
                    <div className="col-lg-6 col-md-8 col-sm-10">
                        <div className="register-card">
                            <div className="register-header text-center mb-4">
                                <div className="register-icon mb-3">
                                    <i className="bi bi-person-add"></i>
                                </div>
                                <h2 className="register-title mb-2">Crear Cuenta</h2>
                                <p className="register-subtitle text-muted">
                                    Completa tus datos para comenzar
                                </p>
                            </div>

                            <form onSubmit={handleRegister} className="register-form">
                                <div className="form-group mb-3">
                                    <label className="form-label fw-semibold">
                                        <i className="bi bi-person me-2 text-primary"></i>
                                        Nombre Completo
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="bi bi-person-fill"></i>
                                        </span>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control form-control-lg"
                                            placeholder="Tu nombre completo"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label fw-semibold">
                                        <i className="bi bi-envelope me-2 text-primary"></i>
                                        Correo Electrónico
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="bi bi-envelope-fill"></i>
                                        </span>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control form-control-lg"
                                            placeholder="tu@email.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label fw-semibold">
                                        <i className="bi bi-lock me-2 text-primary"></i>
                                        Contraseña
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="bi bi-lock-fill"></i>
                                        </span>
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control form-control-lg"
                                            placeholder="Mínimo 6 caracteres"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            minLength="6"
                                        />
                                    </div>
                                    <small className="text-muted">La contraseña debe tener al menos 6 caracteres</small>
                                </div>

                                <div className="form-group mb-4">
                                    <label className="form-label fw-semibold">
                                        <i className="bi bi-person-badge me-2 text-primary"></i>
                                        Tipo de Usuario
                                    </label>
                                    <div className="role-selector">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="role"
                                                id="patient"
                                                value="PATIENT"
                                                checked={formData.role === 'PATIENT'}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="patient">
                                                <i className="bi bi-person me-2"></i>
                                                Paciente
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="role"
                                                id="doctor"
                                                value="DOCTOR"
                                                checked={formData.role === 'DOCTOR'}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="doctor">
                                                <i className="bi bi-stethoscope me-2"></i>
                                                Doctor
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group mb-4">
                                    <button
                                        type="submit"
                                        className="btn btn-register w-100 btn-lg"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Creando Cuenta...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-person-plus me-2"></i>
                                                Crear Cuenta
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="text-center">
                                    <p className="mb-0 text-muted">
                                        ¿Ya tienes cuenta?
                                        <Link to="/" className="login-link ms-2 fw-semibold">
                                            Inicia sesión aquí
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="text-center mt-4">
                            <small className="text-muted">
                                <i className="bi bi-shield-lock me-1"></i>
                                Información protegida • Registro seguro
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .register-container {
                    position: relative;
                    overflow: hidden;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                }

                .shape {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    animation: float 6s ease-in-out infinite;
                }

                .shape-1 {
                    width: 250px;
                    height: 250px;
                    top: 15%;
                    left: 15%;
                    animation-delay: 0s;
                }

                .shape-2 {
                    width: 180px;
                    height: 180px;
                    top: 50%;
                    right: 15%;
                    animation-delay: 2s;
                }

                .shape-3 {
                    width: 120px;
                    height: 120px;
                    bottom: 25%;
                    left: 25%;
                    animation-delay: 4s;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }

                .hero-section {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: 0 2rem 2rem 0;
                    padding: 3rem;
                    position: relative;
                    overflow: hidden;
                }

                .hero-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
                    border-radius: inherit;
                }

                .hero-content {
                    position: relative;
                    z-index: 2;
                }

                .hero-icon {
                    font-size: 4rem;
                    color: #667eea;
                    margin-bottom: 1rem;
                    animation: pulse 2s infinite;
                }

                .hero-title {
                    font-size: 3rem;
                    font-weight: 700;
                    color: #2d3748;
                    margin-bottom: 1rem;
                }

                .hero-subtitle {
                    font-size: 1.1rem;
                    color: #718096;
                    line-height: 1.6;
                    max-width: 400px;
                    margin: 0 auto 2rem;
                }

                .hero-features {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 12px;
                    backdrop-filter: blur(5px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .feature-item i {
                    color: #667eea;
                    font-size: 1.2rem;
                }

                .register-card {
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(20px);
                    border-radius: 24px;
                    padding: 3rem 2.5rem;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .register-icon {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto;
                    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
                }

                .register-icon i {
                    font-size: 2.5rem;
                    color: white;
                }

                .register-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #2d3748;
                    margin-bottom: 0.5rem;
                }

                .register-subtitle {
                    font-size: 0.95rem;
                    color: #718096;
                }

                .form-group {
                    position: relative;
                }

                .input-group-text {
                    background: linear-gradient(135deg, #f8fafc, #e2e8f0);
                    border: 1px solid #e2e8f0;
                    color: #667eea;
                }

                .form-control {
                    border: 2px solid #e2e8f0;
                    border-left: none;
                    border-radius: 0 12px 12px 0;
                    padding: 0.75rem 1rem;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .form-control:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
                    transform: translateY(-1px);
                }

                .input-group:focus-within .input-group-text {
                    background: #667eea;
                    color: white;
                    border-color: #667eea;
                }

                .role-selector {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin-top: 0.5rem;
                }

                .form-check-input:checked {
                    background-color: #667eea;
                    border-color: #667eea;
                }

                .form-check-label {
                    cursor: pointer;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                }

                .form-check-input:checked + .form-check-label {
                    background: rgba(102, 126, 234, 0.1);
                    border-color: #667eea;
                    color: #667eea;
                    font-weight: 600;
                }

                .btn-register {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border: none;
                    color: white;
                    font-weight: 600;
                    padding: 0.875rem 1.5rem;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
                }

                .btn-register:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
                    background: linear-gradient(135deg, #5a67d8, #6b46c1);
                }

                .btn-register:active {
                    transform: translateY(0);
                }

                .login-link {
                    color: #667eea;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                .login-link:hover {
                    color: #764ba2;
                    text-decoration: underline;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }

                @media (max-width: 991px) {
                    .hero-section {
                        display: none;
                    }

                    .register-card {
                        margin: 2rem 1rem;
                        padding: 2rem 1.5rem;
                    }

                    .hero-title {
                        font-size: 2.5rem;
                    }

                    .role-selector {
                        flex-direction: column;
                        align-items: center;
                    }
                }

                @media (max-width: 576px) {
                    .register-card {
                        margin: 1rem;
                        padding: 1.5rem 1rem;
                    }

                    .register-title {
                        font-size: 1.75rem;
                    }

                    .hero-title {
                        font-size: 2rem;
                    }
                }
            `}</style>
        </div>
    );
}

export default RegisterPage;