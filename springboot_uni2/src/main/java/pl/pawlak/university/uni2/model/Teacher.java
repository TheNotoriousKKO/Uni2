package pl.pawlak.university.uni2.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "teachers")
public class Teacher {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Subject> taughtSubjects = new ArrayList<>();
    
    // Constructors
    public Teacher() {}
    
    public Teacher(User user) {
        this.user = user;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public List<Subject> getTaughtSubjects() {
        return taughtSubjects;
    }
    
    public void setTaughtSubjects(List<Subject> taughtSubjects) {
        this.taughtSubjects = taughtSubjects;
    }
    
    // Helper methods
    public void addSubject(Subject subject) {
        taughtSubjects.add(subject);
        subject.setTeacher(this);
    }
    
    public void removeSubject(Subject subject) {
        if (taughtSubjects.remove(subject)) {
            subject.setTeacher(null);
        }
    }
    
    // equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Teacher teacher = (Teacher) o;
        return Objects.equals(id, teacher.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
    
    @Override
    public String toString() {
        return "Teacher{" +
                "id=" + id +
                ", user=" + user +
                '}';
    }
} 