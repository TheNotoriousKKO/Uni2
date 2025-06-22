package pl.pawlak.university.uni2.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.pawlak.university.uni2.model.Grade;

import java.util.List;
import java.util.Optional;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    
    /**
     * Find all grades for a specific student
     * @param studentId the ID of the student
     * @return List of grades for the student
     */
    List<Grade> findByStudentId(Long studentId);
    
    /**
     * Find all grades for a specific subject
     * @param subjectId the ID of the subject
     * @return List of grades for the subject
     */
    List<Grade> findBySubjectId(Long subjectId);
    
    /**
     * Find a specific grade for a student in a particular subject
     * @param studentId the ID of the student
     * @param subjectId the ID of the subject
     * @return Optional containing the grade if found
     */
    Optional<Grade> findByStudentIdAndSubjectId(Long studentId, Long subjectId);
} 