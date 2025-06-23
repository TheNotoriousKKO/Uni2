package pl.pawlak.university.uni2.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    
    /**
     * Find subject by ID and teacher ID
     * @param id the subject ID
     * @param teacherId the teacher ID
     * @return List containing the subject if found and belongs to the teacher
     */
    List<Subject> findByIdAndTeacherId(Long id, Long teacherId);
    
    /**
     * Find subject by code and teacher ID
     * @param code the subject code
     * @param teacherId the teacher ID
     * @return List containing the subject if found and belongs to the teacher
     */
    List<Subject> findByCodeAndTeacherId(String code, Long teacherId);
    
    /**
     * Find subjects by teacher ID and name with case-insensitive partial matching
     * @param teacherId the teacher ID
     * @param name the subject name to search for (partial match)
     * @return List of subjects that match the criteria
     */
    List<Subject> findByTeacherIdAndNameIgnoreCaseContaining(Long teacherId, String name);

    Page<Subject> findByIdAndTeacherId(Long id, Long teacherId, Pageable pageable);
    Page<Subject> findByCodeAndTeacherId(String code, Long teacherId, Pageable pageable);
    Page<Subject> findByTeacherIdAndNameIgnoreCaseContaining(Long teacherId, String name, Pageable pageable);
    Page<Subject> findByTeacherId(Long teacherId, Pageable pageable);
} 