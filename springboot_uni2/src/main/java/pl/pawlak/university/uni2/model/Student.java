package pl.pawlak.university.uni2.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "students")
public class Student {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String indexNumber;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToMany
    @JoinTable(
        name = "student_subjects",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "subject_id")
    )
    private List<Subject> enrolledSubjects = new ArrayList<>();
    
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Grade> grades = new ArrayList<>();
    
    // Constructors
    public Student() {}
    
    public Student(String indexNumber, User user) {
        this.indexNumber = indexNumber;
        this.user = user;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getIndexNumber() {
        return indexNumber;
    }
    
    public void setIndexNumber(String indexNumber) {
        this.indexNumber = indexNumber;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public List<Subject> getEnrolledSubjects() {
        return enrolledSubjects;
    }
    
    public void setEnrolledSubjects(List<Subject> enrolledSubjects) {
        this.enrolledSubjects = enrolledSubjects;
    }
    
    public List<Grade> getGrades() {
        return grades;
    }
    
    public void setGrades(List<Grade> grades) {
        this.grades = grades;
    }
    
    // Helper methods
    public void addSubject(Subject subject) {
        if (!enrolledSubjects.contains(subject)) {
            enrolledSubjects.add(subject);
            subject.getEnrolledStudents().add(this);
        }
    }
    
    public void removeSubject(Subject subject) {
        if (enrolledSubjects.remove(subject)) {
            subject.getEnrolledStudents().remove(this);
        }
    }
    
    public void addGrade(Grade grade) {
        grades.add(grade);
        grade.setStudent(this);
    }
    
    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Student student = (Student) o;
        return Objects.equals(id, student.id) && Objects.equals(indexNumber, student.indexNumber);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id, indexNumber);
    }
    
    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", indexNumber='" + indexNumber + '\'' +
                ", user=" + user +
                '}';
    }
} 