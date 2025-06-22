package pl.pawlak.university.uni2.dto;

import java.util.List;

public class SubjectDto {
    
    private Long id;
    private String name;
    private String code;
    private TeacherDto teacher;
    private List<StudentDto> enrolledStudents;
    
    // Constructors
    public SubjectDto() {}
    
    public SubjectDto(Long id, String name, String code) {
        this.id = id;
        this.name = name;
        this.code = code;
    }
    
    public SubjectDto(Long id, String name, String code, TeacherDto teacher) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.teacher = teacher;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
    
    public TeacherDto getTeacher() {
        return teacher;
    }
    
    public void setTeacher(TeacherDto teacher) {
        this.teacher = teacher;
    }
    
    public List<StudentDto> getEnrolledStudents() {
        return enrolledStudents;
    }
    
    public void setEnrolledStudents(List<StudentDto> enrolledStudents) {
        this.enrolledStudents = enrolledStudents;
    }
    
    @Override
    public String toString() {
        return "SubjectDto{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", teacher=" + teacher +
                '}';
    }
} 