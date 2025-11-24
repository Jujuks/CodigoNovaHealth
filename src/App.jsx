import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

// Componente auxiliar para ocultar Navbar en Login/Registro
function Layout({ children }) {
    const location = useLocation();
    // Solo mostrar Navbar si NO estamos en login o registro
    const showNav = !['/', '/register'].includes(location.pathname);
    return (
        <>
            {showNav && <Navbar />}
            {children}
        </>
    );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/book" element={<BookAppointmentPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;