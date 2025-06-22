package pl.pawlak.university.uni2.dto;

import java.time.LocalDateTime;

public class GradeDto {
    
    private Long id;
    private Double value;
    private LocalDateTime dateAssigned;
    private SubjectDto subject;
    private StudentDto student;
    
    // Constructors
    public GradeDto() {}
    
    public GradeDto(Long id, Double value, LocalDateTime dateAssigned) {
        this.id = id;
        this.value = value;
        this.dateAssigned = dateAssigned;
    }
    
    public GradeDto(Long id, Double value, LocalDateTime dateAssigned, SubjectDto subject) {
        this.id = id;
        this.value = value;
        this.dateAssigned = dateAssigned;
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
    
    public SubjectDto getSubject() {
        return subject;
    }
    
    public void setSubject(SubjectDto subject) {
        this.subject = subject;
    }
    
    public StudentDto getStudent() {
        return student;
    }
    
    public void setStudent(StudentDto student) {
        this.student = student;
    }
    
    @Override
    public String toString() {
        return "GradeDto{" +
                "id=" + id +
                ", value=" + value +
                ", dateAssigned=" + dateAssigned +
                ", subject=" + subject +
                '}';
    }
} 