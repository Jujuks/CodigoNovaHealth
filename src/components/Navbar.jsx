import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            localStorage.removeItem('jwt_token');
            navigate('/');
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-content">
                    {/* Logo */}
                    <Link className="navbar-brand" to="/dashboard">
                        <div className="brand-icon">
                            <i className="bi bi-heart-pulse-fill"></i>
                        </div>
                        <span className="brand-text">NovaHealth</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="navbar-nav">
                        <Link
                            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                            to="/dashboard"
                        >
                            <i className="bi bi-calendar-heart"></i>
                            <span>Mis Citas</span>
                        </Link>

                        <Link
                            className={`nav-link ${isActive('/book') ? 'active' : ''}`}
                            to="/book"
                        >
                            <i className="bi bi-calendar-plus"></i>
                            <span>Agendar Cita</span>
                        </Link>
                    </div>

                    {/* User Actions */}
                    <div className="navbar-actions">
                        <div className="user-info">
                            <div className="user-avatar">
                                <i className="bi bi-person-circle"></i>
                            </div>
                            <span className="user-name">Paciente</span>
                        </div>

                        <button
                            className="btn-logout"
                            onClick={handleLogout}
                            title="Cerrar Sesión"
                        >
                            <i className="bi bi-box-arrow-right"></i>
                            <span>Salir</span>
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .navbar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1030;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(102, 126, 234, 0.1);
                    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
                }

                .navbar-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }

                .navbar-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 70px;
                }

                .navbar-brand {
                    display: flex;
                    align-items: center;
                    text-decoration: none;
                    color: #2d3748;
                    font-weight: 700;
                    font-size: 1.5rem;
                    transition: color 0.3s ease;
                }

                .navbar-brand:hover {
                    color: #667eea;
                }

                .brand-icon {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 0.75rem;
                    color: white;
                    font-size: 1.2rem;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }

                .brand-text {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .navbar-nav {
                    display: flex;
                    gap: 0.5rem;
                }

                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.25rem;
                    border-radius: 12px;
                    text-decoration: none;
                    color: #718096;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .nav-link:hover {
                    color: #667eea;
                    background: rgba(102, 126, 234, 0.1);
                    transform: translateY(-1px);
                }

                .nav-link.active {
                    color: #667eea;
                    background: rgba(102, 126, 234, 0.1);
                    font-weight: 600;
                }

                .nav-link i {
                    font-size: 1.1rem;
                }

                .navbar-actions {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem 1rem;
                    background: rgba(102, 126, 234, 0.1);
                    border-radius: 20px;
                }

                .user-avatar {
                    width: 32px;
                    height: 32px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1rem;
                }

                .user-name {
                    font-weight: 500;
                    color: #2d3748;
                    font-size: 0.9rem;
                }

                .btn-logout {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: linear-gradient(135deg, #dc3545, #c82333);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
                }

                .btn-logout:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 16px rgba(220, 53, 69, 0.4);
                    background: linear-gradient(135deg, #c82333, #bd2130);
                }

                .btn-logout:active {
                    transform: translateY(0);
                }

                .btn-logout i {
                    font-size: 1rem;
                }

                @media (max-width: 768px) {
                    .navbar-content {
                        height: 60px;
                    }

                    .brand-text {
                        display: none;
                    }

                    .navbar-nav {
                        display: none; /* Could be replaced with hamburger menu */
                    }

                    .user-name {
                        display: none;
                    }

                    .btn-logout span {
                        display: none;
                    }
                }

                @media (max-width: 576px) {
                    .navbar-container {
                        padding: 0 0.5rem;
                    }

                    .user-info {
                        display: none;
                    }
                }
            `}</style>
        </nav>
    );
}

export default Navbar;