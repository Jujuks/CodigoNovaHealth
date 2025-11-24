package com.novahealth.controller;

import com.novahealth.model.Appointment;
import com.novahealth.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment, Authentication authentication) {
        // Asumir que patientId viene del token
        String patientId = authentication.getName(); // email como username
        appointment.setPatientId(patientId);
        Appointment created = appointmentService.createAppointment(appointment);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable String id, @RequestBody Appointment appointment) {
        Appointment updated = appointmentService.updateAppointment(id, appointment);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelAppointment(@PathVariable String id) {
        appointmentService.cancelAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/available")
    public ResponseEntity<?> getAvailableSlots(@RequestParam String doctorId,
                                               @RequestParam String start,
                                               @RequestParam String end) {
        // CORRECCIÓN: Validación de formato de fecha para evitar Error 500
        try {
            LocalDateTime startDate = LocalDateTime.parse(start);
            LocalDateTime endDate = LocalDateTime.parse(end);
            List<LocalDateTime> available = appointmentService.getAvailableSlots(doctorId, startDate, endDate);
            return ResponseEntity.ok(available);
        } catch (java.time.format.DateTimeParseException e) {
            // Devuelve un error 400 (Bad Request) con instrucciones claras
            return ResponseEntity.badRequest()
                    .body("Error en formato de fecha. Use formato ISO estricto: 'YYYY-MM-DDTHH:mm:ss' (ej. 2023-12-01T10:00:00)");
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<Appointment>> getPatientHistory(Authentication authentication) {
        String patientId = authentication.getName();
        List<Appointment> history = appointmentService.getPatientHistory(patientId);
        return ResponseEntity.ok(history);
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAppointmentsByPatient(Authentication authentication) {
        String patientId = authentication.getName();
        List<Appointment> appointments = appointmentService.getAppointmentsByPatient(patientId);
        return ResponseEntity.ok(appointments);
    }
}