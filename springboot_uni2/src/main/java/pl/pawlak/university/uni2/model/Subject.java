package pl.pawlak.university.uni2.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "subjects")
public class Subject {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String code;
    
    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;
    
    @ManyToMany(mappedBy = "enrolledSubjects")
    private List<Student> enrolledStudents = new ArrayList<>();
    
    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Grade> grades = new ArrayList<>();
    
    // Constructors
    public Subject() {}
    
    public Subject(String name, String code, Teacher teacher) {
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
    
    public Teacher getTeacher() {
        return teacher;
    }
    
    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }
    
    public List<Student> getEnrolledStudents() {
        return enrolledStudents;
    }
    
    public void setEnrolledStudents(List<Student> enrolledStudents) {
        this.enrolledStudents = enrolledStudents;
    }
    
    public List<Grade> getGrades() {
        return grades;
    }
    
    public void setGrades(List<Grade> grades) {
        this.grades = grades;
    }
    
    // Helper methods
    public void addStudent(Student student) {
        if (!enrolledStudents.contains(student)) {
            enrolledStudents.add(student);
            student.getEnrolledSubjects().add(this);
        }
    }
    
    public void removeStudent(Student student) {
        if (enrolledStudents.remove(student)) {
            student.getEnrolledSubjects().remove(this);
        }
    }
    
    public void addGrade(Grade grade) {
        grades.add(grade);
        grade.setSubject(this);
    }
    
    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Subject subject = (Subject) o;
        return Objects.equals(id, subject.id) && Objects.equals(code, subject.code);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id, code);
    }
    
    @Override
    public String toString() {
        return "Subject{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", code='" + code + '\'' +
                ", teacher=" + teacher +
                '}';
    }
} 