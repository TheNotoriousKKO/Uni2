package pl.pawlak.university.uni2.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "teacher_users")
public class TeacherUser extends User {
    
    public TeacherUser() {
        super();
    }
    
    public TeacherUser(String username, String password, String firstName, String lastName) {
        super(username, password, firstName, lastName, UserRole.TEACHER);
    }
} 