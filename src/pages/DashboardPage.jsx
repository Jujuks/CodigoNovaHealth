import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

function DashboardPage() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Como axiosConfig ya inyecta el token, esta llamada funciona directo
                const response = await api.get('/appointments/history');
                setAppointments(response.data);
            } catch (error) {
                console.error("Error cargando citas", error);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="container mt-5">
            <h1>Mis Citas Médicas</h1>
            <ul className="list-group mt-3">
                {appointments.map((cita) => (
                    <li key={cita.id} className="list-group-item">
                        <strong>Fecha:</strong> {new Date(cita.dateTime).toLocaleString()} <br/>
                        <strong>Notas:</strong> {cita.notes} <br/>
                        <span className="badge bg-success">{cita.status}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DashboardPage;