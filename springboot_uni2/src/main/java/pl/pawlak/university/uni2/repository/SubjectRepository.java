package pl.pawlak.university.uni2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.pawlak.university.uni2.model.Subject;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    
    /**
     * Find all subjects taught by a specific teacher
     * @param teacherId the ID of the teacher
     * @return List of subjects taught by the teacher
     */
    List<Subject> findByTeacherId(Long teacherId);
    
    /**
     * Find subject by code
     * @param code the subject code
     * @return Optional containing the subject if found
     */
    Optional<Subject> findByCode(String code);
} 