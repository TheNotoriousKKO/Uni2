package pl.pawlak.university.uni2.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "grades")
public class Grade {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Double value;
    
    @Column(nullable = false)
    private LocalDateTime dateAssigned;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;
    
    // Constructors
    public Grade() {}
    
    public Grade(Double value, Student student, Subject subject) {
        this.value = value;
        this.student = student;
        this.subject = subject;
        this.dateAssigned = LocalDateTime.now();
    }
    
    public Grade(Double value, LocalDateTime dateAssigned, Student student, Subject subject) {
        this.value = value;
        this.dateAssigned = dateAssigned;
        this.student = student;
        this.subject = subject;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Double getValue() {
        return value;
    }
    
    public void setValue(Double value) {
        this.value = value;
    }
    
    public LocalDateTime getDateAssigned() {
        return dateAssigned;
    }
    
    public void setDateAssigned(LocalDateTime dateAssigned) {
        this.dateAssigned = dateAssigned;
    }
    
    public Student getStudent() {
        return student;
    }
    
    public void setStudent(Student student) {
        this.student = student;
    }
    
    public Subject getSubject() {
        return subject;
    }
    
    public void setSubject(Subject subject) {
        this.subject = subject;
    }
    
    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Grade grade = (Grade) o;
        return Objects.equals(id, grade.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "Grade{" +
                "id=" + id +
                ", value=" + value +
                ", dateAssigned=" + dateAssigned +
                ", student=" + student +
                ", subject=" + subject +
                '}';
    }
} 