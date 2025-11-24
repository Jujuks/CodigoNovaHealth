package com.novahealth.repository;

import com.novahealth.model.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    List<Appointment> findByPatientId(String patientId);
    List<Appointment> findByDoctorId(String doctorId);
    List<Appointment> findByDoctorIdAndDateTimeBetween(String doctorId, LocalDateTime start, LocalDateTime end);
    List<Appointment> findByPatientIdAndStatus(String patientId, String status);
}