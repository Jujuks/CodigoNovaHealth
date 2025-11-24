import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

function DashboardPage() {
    const [appointments, setAppointments] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [editForm, setEditForm] = useState({ dateTime: '', notes: '' });
    const [filter, setFilter] = useState('ALL');

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
        if (window.confirm('¿Estás seguro de que quieres cancelar esta cita? Esta acción no se puede deshacer.')) {
            try {
                await api.delete(`/appointments/${id}`);
                fetchAppointments();
            } catch (error) {
                console.error("Error cancelando cita", error);
                alert('Error al cancelar la cita. Inténtalo de nuevo.');
            }
        }
    };

    const handleEdit = (appointment) => {
        setEditingAppointment(appointment);
        setEditForm({
            dateTime: new Date(appointment.dateTime).toISOString().slice(0, 16),
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
            setShowEditModal(false);
            fetchAppointments();
        } catch (error) {
            console.error("Error actualizando cita", error);
            alert('Error al actualizar la cita. Verifica los datos e inténtalo de nuevo.');
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'SCHEDULED':
                return { color: 'primary', icon: 'bi-calendar-check', text: 'Programada' };
            case 'COMPLETED':
                return { color: 'success', icon: 'bi-check-circle', text: 'Completada' };
            case 'CANCELLED':
                return { color: 'danger', icon: 'bi-x-circle', text: 'Cancelada' };
            default:
                return { color: 'secondary', icon: 'bi-question-circle', text: 'Desconocido' };
        }
    };

    const filteredAppointments = appointments.filter(appointment => {
        if (filter === 'ALL') return true;
        return appointment.status === filter;
    });

    const getUpcomingAppointments = () => {
        return appointments.filter(app =>
            app.status === 'SCHEDULED' &&
            new Date(app.dateTime) > new Date()
        ).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
    };

    return (
        <div className="min-vh-100 bg-light">
            {/* Header */}
            <div className="bg-white shadow-sm border-bottom">
                <div className="container-fluid py-4">
                    <div className="row align-items-center">
                        <div className="col">
                            <h1 className="h3 mb-0 text-primary fw-bold">
                                <i className="bi bi-calendar-heart me-2"></i>
                                Panel de Citas Médicas
                            </h1>
                            <p className="text-muted mb-0">Gestiona tus citas de forma segura y eficiente</p>
                        </div>
                        <div className="col-auto">
                            <div className="d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                                    <i className="bi bi-person-circle text-primary fs-4"></i>
                                </div>
                                <div>
                                    <small className="text-muted d-block">Paciente</small>
                                    <strong>Usuario Activo</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid py-4">
                {/* Stats Cards */}
                <div className="row mb-4">
                    <div className="col-md-3 mb-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body text-center">
                                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                                    <i className="bi bi-calendar-check text-primary fs-4"></i>
                                </div>
                                <h4 className="mt-2 mb-1">{appointments.filter(a => a.status === 'SCHEDULED').length}</h4>
                                <small className="text-muted">Citas Programadas</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body text-center">
                                <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                                    <i className="bi bi-check-circle text-success fs-4"></i>
                                </div>
                                <h4 className="mt-2 mb-1">{appointments.filter(a => a.status === 'COMPLETED').length}</h4>
                                <small className="text-muted">Citas Completadas</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body text-center">
                                <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                                    <i className="bi bi-clock text-info fs-4"></i>
                                </div>
                                <h4 className="mt-2 mb-1">{getUpcomingAppointments().length}</h4>
                                <small className="text-muted">Próximas Citas</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body text-center">
                                <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                                    <i className="bi bi-calendar-plus text-warning fs-4"></i>
                                </div>
                                <h4 className="mt-2 mb-1">{appointments.length}</h4>
                                <small className="text-muted">Total de Citas</small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Próxima Cita */}
                {getUpcomingAppointments().length > 0 && (
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card border-primary shadow-sm">
                                <div className="card-header bg-primary text-white">
                                    <h5 className="mb-0">
                                        <i className="bi bi-bell me-2"></i>
                                        Tu Próxima Cita
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col-md-8">
                                            <h6 className="mb-1">Consulta Médica</h6>
                                            <p className="mb-1">
                                                <i className="bi bi-calendar-event me-2"></i>
                                                {new Date(getUpcomingAppointments()[0].dateTime).toLocaleDateString('es-ES', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <p className="mb-0">
                                                <i className="bi bi-clock me-2"></i>
                                                {new Date(getUpcomingAppointments()[0].dateTime).toLocaleTimeString('es-ES', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className="col-md-4 text-end">
                                            <span className="badge bg-primary fs-6 px-3 py-2">
                                                <i className="bi bi-calendar-check me-1"></i>
                                                Programada
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filtros y Lista de Citas */}
                <div className="card shadow-sm">
                    <div className="card-header bg-white">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                                <i className="bi bi-list-ul me-2 text-primary"></i>
                                Historial de Citas
                            </h5>
                            <div className="btn-group" role="group">
                                <input type="radio" className="btn-check" name="filter" id="all" checked={filter === 'ALL'} onChange={() => setFilter('ALL')} />
                                <label className="btn btn-outline-primary btn-sm" htmlFor="all">Todas</label>

                                <input type="radio" className="btn-check" name="filter" id="scheduled" checked={filter === 'SCHEDULED'} onChange={() => setFilter('SCHEDULED')} />
                                <label className="btn btn-outline-primary btn-sm" htmlFor="scheduled">Programadas</label>

                                <input type="radio" className="btn-check" name="filter" id="completed" checked={filter === 'COMPLETED'} onChange={() => setFilter('COMPLETED')} />
                                <label className="btn btn-outline-primary btn-sm" htmlFor="completed">Completadas</label>

                                <input type="radio" className="btn-check" name="filter" id="cancelled" checked={filter === 'CANCELLED'} onChange={() => setFilter('CANCELLED')} />
                                <label className="btn btn-outline-primary btn-sm" htmlFor="cancelled">Canceladas</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        {filteredAppointments.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="bi bi-calendar-x text-muted" style={{fontSize: '3rem'}}></i>
                                <h5 className="mt-3 text-muted">No hay citas para mostrar</h5>
                                <p className="text-muted">Programa tu primera cita médica</p>
                            </div>
                        ) : (
                            <div className="row">
                                {filteredAppointments.map((cita) => {
                                    const statusInfo = getStatusInfo(cita.status);
                                    return (
                                        <div key={cita.id} className="col-lg-6 mb-3">
                                            <div className="card h-100 border-0 shadow-sm hover-card">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <div>
                                                            <h6 className="card-title mb-1">
                                                                <i className="bi bi-calendar-event me-2 text-primary"></i>
                                                                Consulta Médica
                                                            </h6>
                                                            <small className="text-muted">ID: {cita.id.slice(-8)}</small>
                                                        </div>
                                                        <span className={`badge bg-${statusInfo.color} d-flex align-items-center`}>
                                                            <i className={`bi ${statusInfo.icon} me-1`}></i>
                                                            {statusInfo.text}
                                                        </span>
                                                    </div>

                                                    <div className="row mb-3">
                                                        <div className="col-sm-6">
                                                            <small className="text-muted d-block">FECHA</small>
                                                            <strong>{new Date(cita.dateTime).toLocaleDateString('es-ES')}</strong>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <small className="text-muted d-block">HORA</small>
                                                            <strong>{new Date(cita.dateTime).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})}</strong>
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <small className="text-muted d-block">NOTAS</small>
                                                        <p className="mb-0 small">{cita.notes || 'Sin notas adicionales'}</p>
                                                    </div>

                                                    {cita.status === 'SCHEDULED' && (
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-outline-primary btn-sm flex-fill"
                                                                onClick={() => handleEdit(cita)}
                                                            >
                                                                <i className="bi bi-pencil me-1"></i>
                                                                Editar
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger btn-sm flex-fill"
                                                                onClick={() => handleCancel(cita.id)}
                                                            >
                                                                <i className="bi bi-x-circle me-1"></i>
                                                                Cancelar
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Edición Mejorado */}
            {showEditModal && (
                <div className="modal show d-block" tabIndex="-1" style={{zIndex: 1055}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">
                                    <i className="bi bi-pencil-square me-2"></i>
                                    Editar Cita Médica
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-calendar-event me-1"></i>
                                            Nueva Fecha y Hora
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className="form-control form-control-lg"
                                            value={editForm.dateTime}
                                            onChange={(e) => setEditForm({...editForm, dateTime: e.target.value})}
                                            required
                                        />
                                        <small className="text-muted">Selecciona la nueva fecha y hora para tu cita</small>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            <i className="bi bi-card-text me-1"></i>
                                            Notas de la Consulta
                                        </label>
                                        <textarea
                                            className="form-control"
                                            rows="4"
                                            value={editForm.notes}
                                            onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                                            placeholder="Describe el motivo de tu consulta médica..."
                                        ></textarea>
                                        <small className="text-muted">Opcional: Agrega detalles sobre tu consulta</small>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowEditModal(false)}>
                                    <i className="bi bi-x me-1"></i>
                                    Cancelar
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveEdit}>
                                    <i className="bi bi-check-circle me-1"></i>
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showEditModal && <div className="modal-backdrop show" style={{zIndex: 1050}}></div>}

            <style jsx>{`
                .hover-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .hover-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
                }
                .card {
                    border-radius: 12px;
                }
                .btn {
                    border-radius: 8px;
                }
                .badge {
                    border-radius: 20px;
                    font-weight: 500;
                }
            `}</style>
        </div>
    );
}

export default DashboardPage;