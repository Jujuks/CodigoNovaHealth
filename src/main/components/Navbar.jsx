import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('jwt_token'); // Borrar la llave
        navigate('/'); // Sacar al usuario
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container">
                <Link className="navbar-brand" to="/dashboard">NovaHealth</Link>
                <div className="d-flex">
                    <Link className="btn btn-outline-light me-2" to="/dashboard">Mis Citas</Link>
                    <Link className="btn btn-primary me-2" to="/book">Agendar Cita</Link>
                    <button onClick={handleLogout} className="btn btn-danger">Salir</button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;