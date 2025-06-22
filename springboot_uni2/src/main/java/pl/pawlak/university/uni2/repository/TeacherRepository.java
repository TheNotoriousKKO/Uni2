package pl.pawlak.university.uni2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.pawlak.university.uni2.model.Teacher;

import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    
    /**
     * Find teacher by associated user's username
     * @param username the username of the associated user
     * @return Optional containing the teacher if found
     */
    Optional<Teacher> findByUserUsername(String username);
} 