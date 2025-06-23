package pl.pawlak.university.uni2.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.pawlak.university.uni2.model.Student;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    /**
     * Find student by associated user's username
     * @param username the username of the associated user
     * @return Optional containing the student if found
     */
    Optional<Student> findByUserUsername(String username);
    
    /**
     * Find students by user's first name, case-insensitive
     * @param firstName the first name to search for
     * @return List of matching students
     */
    List<Student> findByUserFirstNameContainingIgnoreCase(String firstName);
    
    /**
     * Find students by user's last name, case-insensitive
     * @param lastName the last name to search for
     * @return List of matching students
     */
    List<Student> findByUserLastNameContainingIgnoreCase(String lastName);

    Page<Student> findByUserFirstNameContainingIgnoreCase(String firstName, Pageable pageable);
    Page<Student> findByUserLastNameContainingIgnoreCase(String lastName, Pageable pageable);
} 