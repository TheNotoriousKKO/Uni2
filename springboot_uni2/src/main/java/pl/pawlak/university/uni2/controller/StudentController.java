package pl.pawlak.university.uni2.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import pl.pawlak.university.uni2.dto.GradeDto;
import pl.pawlak.university.uni2.dto.StudentDto;
import pl.pawlak.university.uni2.dto.SubjectDto;
import pl.pawlak.university.uni2.dto.TeacherDto;
import pl.pawlak.university.uni2.model.Grade;
import pl.pawlak.university.uni2.model.Student;
import pl.pawlak.university.uni2.model.Subject;
import pl.pawlak.university.uni2.repository.GradeRepository;
import pl.pawlak.university.uni2.repository.StudentRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/student")
public class StudentController {
    
    private final StudentRepository studentRepository;
    private final GradeRepository gradeRepository;
    
    public StudentController(StudentRepository studentRepository, GradeRepository gradeRepository) {
        this.studentRepository = studentRepository;
        this.gradeRepository = gradeRepository;
    }
    
    @GetMapping("/subjects")
    public ResponseEntity<List<SubjectDto>> getEnrolledSubjects() {
        String username = getCurrentUsername();
        
        Student student = studentRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
        
        List<SubjectDto> subjects = student.getEnrolledSubjects().stream()
                .map(this::mapToSubjectDto)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(subjects);
    }
    
    @GetMapping("/grades")
    public ResponseEntity<List<GradeDto>> getGrades() {
        String username = getCurrentUsername();
        
        Student student = studentRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
        
        List<Grade> grades = gradeRepository.findByStudentId(student.getId());
        
        List<GradeDto> gradeDtos = grades.stream()
                .map(this::mapToGradeDto)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(gradeDtos);
    }
    
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        return authentication.getName();
    }
    
    private SubjectDto mapToSubjectDto(Subject subject) {
        SubjectDto dto = new SubjectDto(subject.getId(), subject.getName(), subject.getCode());
        
        if (subject.getTeacher() != null) {
            TeacherDto teacherDto = new TeacherDto(
                    subject.getTeacher().getId(),
                    subject.getTeacher().getUser().getUsername(),
                    subject.getTeacher().getUser().getEmail()
            );
            dto.setTeacher(teacherDto);
        }
        
        return dto;
    }
    
    private GradeDto mapToGradeDto(Grade grade) {
        GradeDto dto = new GradeDto(grade.getId(), grade.getValue(), grade.getDateAssigned());
        
        if (grade.getSubject() != null) {
            SubjectDto subjectDto = mapToSubjectDto(grade.getSubject());
            dto.setSubject(subjectDto);
        }
        
        if (grade.getStudent() != null) {
            StudentDto studentDto = new StudentDto(
                    grade.getStudent().getId(),
                    grade.getStudent().getIndexNumber(),
                    grade.getStudent().getUser().getUsername(),
                    grade.getStudent().getUser().getEmail()
            );
            dto.setStudent(studentDto);
        }
        
        return dto;
    }
} 