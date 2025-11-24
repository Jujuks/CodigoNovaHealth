import { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

function BookAppointmentPage() {
    const [doctorId, setDoctorId] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [notes, setNotes] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Formatear la fecha para que coincida con LocalDateTime de Java (YYYY-MM-DDTHH:mm:ss)
            const formattedDate = new Date(dateTime).toISOString().slice(0, 19);

            await api.post('/appointments', {
                doctorId: doctorId,
                dateTime: formattedDate,
                notes: notes
            });
            
            alert('¡Cita agendada con éxito!');
            navigate('/dashboard');
        } catch (error) {
            alert('Error al agendar. Verifica el formato de fecha o el doctor.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Agendar Nueva Cita</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Correo del Doctor:</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        placeholder="doctor@ejemplo.com"
                        value={doctorId}
                        onChange={(e) => setDoctorId(e.target.value)} 
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Fecha y Hora:</label>
                    <input 
                        type="datetime-local" 
                        className="form-control"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        required 
                    />
                </div>
                <div className="mb-3">
                    <textarea 
                        className="form-control" 
                        placeholder="Motivo de la consulta..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Confirmar Cita</button>
            </form>
        </div>
    );
}

export default BookAppointmentPage;