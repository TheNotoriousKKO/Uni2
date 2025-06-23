package pl.pawlak.university.uni2.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "student_users")
public class StudentUser extends User {
    
    public StudentUser() {
        super();
    }
    
    public StudentUser(String username, String password, String firstName, String lastName) {
        super(username, password, firstName, lastName, UserRole.STUDENT);
    }
} 