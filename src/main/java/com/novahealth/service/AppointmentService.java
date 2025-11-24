package com.novahealth.service;

import com.novahealth.model.Appointment;
import com.novahealth.model.User;
import com.novahealth.repository.AppointmentRepository;
import com.novahealth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public Appointment createAppointment(Appointment appointment) {
        appointment.setStatus("SCHEDULED");
        Appointment saved = appointmentRepository.save(appointment);

        // CORRECCIÓN: Manejo de errores en el envío de correo (try-catch)
        // Esto evita que la aplicación lance un Error 500 si Gmail falla.
        User patient = userRepository.findById(appointment.getPatientId()).orElse(null);
        if (patient != null) {
            try {
                emailService.sendNotification(patient.getEmail(), "Cita Agendada",
                        "Su cita ha sido agendada para " + appointment.getDateTime());
            } catch (Exception e) {
                // Solo registramos el error en la consola, pero la cita YA se guardó exitosamente.
                System.out.println("ADVERTENCIA: No se pudo enviar el correo de confirmación: " + e.getMessage());
            }
        }
        return saved;
    }

    public Appointment updateAppointment(String id, Appointment updatedAppointment) {
        // CORRECCIÓN: Mensaje de error más descriptivo
        Appointment existing = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se encontró la cita con ID: " + id));
        
        existing.setDateTime(updatedAppointment.getDateTime());
        existing.setNotes(updatedAppointment.getNotes());
        return appointmentRepository.save(existing);
    }

    public void cancelAppointment(String id) {
        // CORRECCIÓN: Mensaje de error más descriptivo
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se encontró la cita con ID para cancelar: " + id));
        
        appointment.setStatus("CANCELLED");
        appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsByPatient(String patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctor(String doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<LocalDateTime> getAvailableSlots(String doctorId, LocalDateTime start, LocalDateTime end) {
        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndDateTimeBetween(doctorId, start, end);
        // Lógica simple: asumir slots cada hora, filtrar ocupados
        List<LocalDateTime> available = new java.util.ArrayList<>();
        LocalDateTime current = start;
        while (current.isBefore(end)) {
            LocalDateTime slot = current;
            boolean occupied = appointments.stream().anyMatch(a -> a.getDateTime().equals(slot));
            if (!occupied) {
                available.add(slot);
            }
            current = current.plusHours(1);
        }
        return available;
    }

    public List<Appointment> getPatientHistory(String patientId) {
        return appointmentRepository.findByPatientIdAndStatus(patientId, "COMPLETED");
    }
}