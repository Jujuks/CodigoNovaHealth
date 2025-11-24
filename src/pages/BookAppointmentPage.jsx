import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

function BookAppointmentPage() {
    const [doctorId, setDoctorId] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [showSlots, setShowSlots] = useState(false);
    const navigate = useNavigate();

    // Calcular fecha mínima (mañana)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDateTime = tomorrow.toISOString().slice(0, 16);

    const checkAvailableSlots = async () => {
        if (!doctorId) {
            alert('Primero ingresa el correo del doctor');
            return;
        }

        try {
            const startDate = new Date().toISOString().slice(0, 10) + 'T09:00:00';
            const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + 'T17:00:00';

            const response = await api.get('/appointments/available', {
                params: {
                    doctorId,
                    start: startDate,
                    end: endDate
                }
            });

            setAvailableSlots(response.data);
            setShowSlots(true);
        } catch (error) {
            console.error('Error obteniendo slots disponibles:', error);
            alert('Error al obtener horarios disponibles. Verifica el correo del doctor.');
        }
    };

    const selectSlot = (slot) => {
        setDateTime(slot);
        setShowSlots(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formattedDate = new Date(dateTime).toISOString().slice(0, 19);

            await api.post('/appointments', {
                doctorId: doctorId,
                dateTime: formattedDate,
                notes: notes
            });

            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Error al agendar la cita. Verifica los datos e inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="book-container">
            {/* Background Shapes */}
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>

            <div className="container-fluid py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10">
                        <div className="book-card">
                            <div className="book-header text-center mb-4">
                                <div className="book-icon mb-3">
                                    <i className="bi bi-calendar-plus"></i>
                                </div>
                                <h2 className="book-title mb-2">Agendar Nueva Cita</h2>
                                <p className="book-subtitle text-muted">
                                    Selecciona tu doctor y horario preferido
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="book-form">
                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <div className="form-group">
                                            <label className="form-label fw-semibold">
                                                <i className="bi bi-envelope me-2 text-primary"></i>
                                                Correo del Doctor
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    <i className="bi bi-envelope-fill"></i>
                                                </span>
                                                <input
                                                    type="email"
                                                    className="form-control form-control-lg"
                                                    placeholder="doctor@ejemplo.com"
                                                    value={doctorId}
                                                    onChange={(e) => setDoctorId(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary btn-sm mt-2"
                                                onClick={checkAvailableSlots}
                                                disabled={!doctorId}
                                            >
                                                <i className="bi bi-search me-1"></i>
                                                Ver Horarios Disponibles
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <div className="form-group">
                                            <label className="form-label fw-semibold">
                                                <i className="bi bi-clock me-2 text-primary"></i>
                                                Fecha y Hora
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    <i className="bi bi-calendar-event-fill"></i>
                                                </span>
                                                <input
                                                    type="datetime-local"
                                                    className="form-control form-control-lg"
                                                    value={dateTime}
                                                    onChange={(e) => setDateTime(e.target.value)}
                                                    min={minDateTime}
                                                    required
                                                />
                                            </div>
                                            <small className="text-muted">Selecciona una fecha futura</small>
                                        </div>
                                    </div>
                                </div>

                                {/* Available Slots */}
                                {showSlots && availableSlots.length > 0 && (
                                    <div className="mb-4">
                                        <h6 className="fw-semibold mb-3">
                                            <i className="bi bi-calendar-check me-2 text-success"></i>
                                            Horarios Disponibles
                                        </h6>
                                        <div className="slots-grid">
                                            {availableSlots.slice(0, 12).map((slot, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    className="btn btn-outline-primary btn-sm slot-btn"
                                                    onClick={() => selectSlot(slot)}
                                                >
                                                    <i className="bi bi-clock me-1"></i>
                                                    {new Date(slot).toLocaleDateString('es-ES', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })} {new Date(slot).toLocaleTimeString('es-ES', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </button>
                                            ))}
                                        </div>
                                        <small className="text-muted">Haz clic en un horario para seleccionarlo</small>
                                    </div>
                                )}

                                {showSlots && availableSlots.length === 0 && (
                                    <div className="alert alert-warning">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        No hay horarios disponibles para este doctor en los próximos días.
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label className="form-label fw-semibold">
                                        <i className="bi bi-card-text me-2 text-primary"></i>
                                        Motivo de la Consulta
                                    </label>
                                    <textarea
                                        className="form-control form-control-lg"
                                        rows="4"
                                        placeholder="Describe brevemente el motivo de tu consulta médica..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    ></textarea>
                                    <small className="text-muted">Opcional: Ayuda al doctor a prepararse para tu consulta</small>
                                </div>

                                <div className="text-center">
                                    <button
                                        type="submit"
                                        className="btn btn-book btn-lg px-5"
                                        disabled={isLoading || !doctorId || !dateTime}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Agendando Cita...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle me-2"></i>
                                                Confirmar Cita
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Info Cards */}
                        <div className="row mt-4">
                            <div className="col-md-4 mb-3">
                                <div className="info-card text-center">
                                    <div className="info-icon">
                                        <i className="bi bi-clock"></i>
                                    </div>
                                    <h6>Horarios Flexibles</h6>
                                    <small className="text-muted">Lunes a Viernes, 9:00 - 17:00</small>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="info-card text-center">
                                    <div className="info-icon">
                                        <i className="bi bi-shield-check"></i>
                                    </div>
                                    <h6>Consulta Segura</h6>
                                    <small className="text-muted">Información protegida</small>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3">
                                <div className="info-card text-center">
                                    <div className="info-icon">
                                        <i className="bi bi-chat-dots"></i>
                                    </div>
                                    <h6>Seguimiento</h6>
                                    <small className="text-muted">Comunicación directa</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .book-container {
                    position: relative;
                    overflow: hidden;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    padding-top: 80px; /* Space for navbar */
                }

                .shape {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    animation: float 6s ease-in-out infinite;
                }

                .shape-1 {
                    width: 200px;
                    height: 200px;
                    top: 20%;
                    left: 10%;
                    animation-delay: 0s;
                }

                .shape-2 {
                    width: 150px;
                    height: 150px;
                    top: 60%;
                    right: 15%;
                    animation-delay: 2s;
                }

                .shape-3 {
                    width: 100px;
                    height: 100px;
                    bottom: 30%;
                    left: 30%;
                    animation-delay: 4s;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }

                .book-card {
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(20px);
                    border-radius: 24px;
                    padding: 3rem 2.5rem;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .book-icon {
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

                .book-icon i {
                    font-size: 2.5rem;
                    color: white;
                }

                .book-title {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #2d3748;
                    margin-bottom: 0.5rem;
                }

                .book-subtitle {
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

                .slots-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 0.5rem;
                    margin-bottom: 0.5rem;
                }

                .slot-btn {
                    border-radius: 8px;
                    font-size: 0.85rem;
                    padding: 0.5rem 0.75rem;
                    transition: all 0.3s ease;
                }

                .slot-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
                }

                .btn-book {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border: none;
                    color: white;
                    font-weight: 600;
                    padding: 0.875rem 2rem;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
                }

                .btn-book:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
                    background: linear-gradient(135deg, #5a67d8, #6b46c1);
                }

                .btn-book:active {
                    transform: translateY(0);
                }

                .info-card {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    padding: 1.5rem 1rem;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    transition: transform 0.3s ease;
                }

                .info-card:hover {
                    transform: translateY(-5px);
                }

                .info-icon {
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem;
                    color: white;
                    font-size: 1.5rem;
                }

                .info-card h6 {
                    color: #2d3748;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }

                @media (max-width: 768px) {
                    .book-card {
                        margin: 1rem;
                        padding: 2rem 1.5rem;
                    }

                    .book-title {
                        font-size: 1.75rem;
                    }

                    .slots-grid {
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    }

                    .info-card {
                        margin-bottom: 1rem;
                    }
                }
            `}</style>
        </div>
    );
}

export default BookAppointmentPage;