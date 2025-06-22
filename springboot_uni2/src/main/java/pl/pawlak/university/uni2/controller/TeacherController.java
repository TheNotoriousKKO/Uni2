package pl.pawlak.university.uni2.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import pl.pawlak.university.uni2.dto.CreateGradeRequest;
import pl.pawlak.university.uni2.dto.CreateSubjectRequest;
import pl.pawlak.university.uni2.dto.GradeDto;
import pl.pawlak.university.uni2.dto.SubjectDto;
import pl.pawlak.university.uni2.model.Grade;
import pl.pawlak.university.uni2.model.Student;
import pl.pawlak.university.uni2.model.Subject;
import pl.pawlak.university.uni2.model.Teacher;
import pl.pawlak.university.uni2.repository.GradeRepository;
import pl.pawlak.university.uni2.repository.StudentRepository;
import pl.pawlak.university.uni2.repository.SubjectRepository;
import pl.pawlak.university.uni2.repository.TeacherRepository;

@RestController
@RequestMapping("/api/v1/teacher")
public class TeacherController {
    
    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;
    private final GradeRepository gradeRepository;
    
    public TeacherController(TeacherRepository teacherRepository,
                           SubjectRepository subjectRepository,
                           StudentRepository studentRepository,
                           GradeRepository gradeRepository) {
        this.teacherRepository = teacherRepository;
        this.subjectRepository = subjectRepository;
        this.studentRepository = studentRepository;
        this.gradeRepository = gradeRepository;
    }
    
    @PostMapping("/subjects")
    public ResponseEntity<SubjectDto> createSubject(@Valid @RequestBody CreateSubjectRequest request) {
        String username = getCurrentUsername();
        
        Teacher teacher = teacherRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher not found"));
        
        // Check if subject code already exists
        if (subjectRepository.findByCode(request.getCode()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Subject with this code already exists");
        }
        
        Subject subject = new Subject(request.getName(), request.getCode(), teacher);
        Subject savedSubject = subjectRepository.save(subject);
        
        SubjectDto subjectDto = new SubjectDto(
                savedSubject.getId(),
                savedSubject.getName(),
                savedSubject.getCode()
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(subjectDto);
    }
    
    @PostMapping("/grades")
    public ResponseEntity<GradeDto> assignGrade(@Valid @RequestBody CreateGradeRequest request) {
        String username = getCurrentUsername();
        
        Teacher teacher = teacherRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher not found"));
        
        // Find the subject and verify the teacher owns it
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subject not found"));
        
        if (!subject.getTeacher().getId().equals(teacher.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only assign grades to your own subjects");
        }
        
        // Find the student
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
        
        // Check if student is enrolled in the subject
        boolean isEnrolled = student.getEnrolledSubjects().stream()
                .anyMatch(s -> s.getId().equals(subject.getId()));
        
        if (!isEnrolled) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Student is not enrolled in this subject");
        }
        
        // Check if grade already exists for this student and subject
        gradeRepository.findByStudentIdAndSubjectId(student.getId(), subject.getId())
                .ifPresent(existingGrade -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, 
                            "Grade already exists for this student in this subject");
                });
        
        // Create and save the grade
        Grade grade = new Grade(request.getValue(), student, subject);
        Grade savedGrade = gradeRepository.save(grade);
        
        GradeDto gradeDto = new GradeDto(
                savedGrade.getId(),
                savedGrade.getValue(),
                savedGrade.getDateAssigned()
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(gradeDto);
    }
    
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        return authentication.getName();
    }
} 