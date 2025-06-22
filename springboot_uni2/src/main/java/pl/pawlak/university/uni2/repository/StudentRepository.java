package pl.pawlak.university.uni2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.pawlak.university.uni2.model.Student;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    /**
     * Find student by associated user's username
     * @param username the username of the associated user
     * @return Optional containing the student if found
     */
    Optional<Student> findByUserUsername(String username);
} 