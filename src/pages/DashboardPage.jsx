import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

function DashboardPage() {
    const [appointments, setAppointments] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [editForm, setEditForm] = useState({ dateTime: '', notes: '' });

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error("Error cargando citas", error);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleCancel = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
            try {
                await api.delete(`/appointments/${id}`);
                alert('Cita cancelada exitosamente');
                fetchAppointments(); // Recargar la lista
            } catch (error) {
                console.error("Error cancelando cita", error);
                alert('Error al cancelar la cita');
            }
        }
    };

    const handleEdit = (appointment) => {
        setEditingAppointment(appointment);
        setEditForm({
            dateTime: new Date(appointment.dateTime).toISOString().slice(0, 16), // Formato datetime-local
            notes: appointment.notes || ''
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            const updatedData = {
                dateTime: new Date(editForm.dateTime).toISOString(),
                notes: editForm.notes
            };
            await api.put(`/appointments/${editingAppointment.id}`, updatedData);
            alert('Cita actualizada exitosamente');
            setShowEditModal(false);
            fetchAppointments(); // Recargar la lista
        } catch (error) {
            console.error("Error actualizando cita", error);
            alert('Error al actualizar la cita');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'SCHEDULED': return 'bg-primary';
            case 'COMPLETED': return 'bg-success';
            case 'CANCELLED': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    return (
        <div className="container mt-5">
            <h1>Mis Citas Médicas</h1>
            <div className="row mt-3">
                {appointments.map((cita) => (
                    <div key={cita.id} className="col-md-6 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Cita Médica</h5>
                                <p className="card-text">
                                    <strong>Fecha:</strong> {new Date(cita.dateTime).toLocaleString()} <br/>
                                    <strong>Notas:</strong> {cita.notes || 'Sin notas'} <br/>
                                    <strong>Estado:</strong> <span className={`badge ${getStatusBadge(cita.status)}`}>{cita.status}</span>
                                </p>
                                {cita.status === 'SCHEDULED' && (
                                    <div className="btn-group">
                                        <button className="btn btn-warning btn-sm" onClick={() => handleEdit(cita)}>
                                            Editar
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(cita.id)}>
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {appointments.length === 0 && (
                <div className="alert alert-info mt-3">
                    No tienes citas programadas.
                </div>
            )}

            {/* Modal de Edición */}
            {showEditModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Cita</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label">Nueva Fecha y Hora</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            value={editForm.dateTime}
                                            onChange={(e) => setEditForm({...editForm, dateTime: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Notas</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={editForm.notes}
                                            onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                                            placeholder="Motivo de la consulta..."
                                        ></textarea>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                                    Cancelar
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveEdit}>
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showEditModal && <div className="modal-backdrop show"></div>}
        </div>
    );
}

export default DashboardPage;