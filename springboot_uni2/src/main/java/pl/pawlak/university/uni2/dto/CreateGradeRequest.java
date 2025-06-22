package pl.pawlak.university.uni2.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.DecimalMax;

public class CreateGradeRequest {
    
    @NotNull(message = "Student ID is required")
    private Long studentId;
    
    @NotNull(message = "Subject ID is required")
    private Long subjectId;
    
    @NotNull(message = "Grade value is required")
    @DecimalMin(value = "1.0", message = "Grade must be at least 1.0")
    @DecimalMax(value = "6.0", message = "Grade must be at most 6.0")
    private Double value;
    
    // Constructors
    public CreateGradeRequest() {}
    
    public CreateGradeRequest(Long studentId, Long subjectId, Double value) {
        this.studentId = studentId;
        this.subjectId = subjectId;
        this.value = value;
    }
    
    // Getters and Setters
    public Long getStudentId() {
        return studentId;
    }
    
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
    
    public Long getSubjectId() {
        return subjectId;
    }
    
    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }
    
    public Double getValue() {
        return value;
    }
    
    public void setValue(Double value) {
        this.value = value;
    }
    
    @Override
    public String toString() {
        return "CreateGradeRequest{" +
                "studentId=" + studentId +
                ", subjectId=" + subjectId +
                ", value=" + value +
                '}';
    }
} 