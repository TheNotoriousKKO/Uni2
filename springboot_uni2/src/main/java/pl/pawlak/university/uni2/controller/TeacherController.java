package pl.pawlak.university.uni2.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import pl.pawlak.university.uni2.dto.CreateGradeRequest;
import pl.pawlak.university.uni2.dto.CreateSubjectRequest;
import pl.pawlak.university.uni2.dto.GradeDto;
import pl.pawlak.university.uni2.dto.StudentDto;
import pl.pawlak.university.uni2.dto.SubjectDto;
import pl.pawlak.university.uni2.model.Grade;
import pl.pawlak.university.uni2.model.Student;
import pl.pawlak.university.uni2.model.Subject;
import pl.pawlak.university.uni2.model.Teacher;
import pl.pawlak.university.uni2.repository.GradeRepository;
import pl.pawlak.university.uni2.repository.StudentRepository;
import pl.pawlak.university.uni2.repository.SubjectRepository;
import pl.pawlak.university.uni2.repository.TeacherRepository;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Collections;
import java.util.ArrayList;

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
    
    @GetMapping("/subjects/search")
    public ResponseEntity<List<SubjectDto>> searchSubjects(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String name) {
        String username = getCurrentUsername();
        Teacher teacher = teacherRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher not found"));
        List<Subject> subjects;
        if (id != null) {
            subjects = subjectRepository.findByIdAndTeacherId(id, teacher.getId(), PageRequest.of(0, 10)).getContent();
        } else if (code != null && !code.trim().isEmpty()) {
            subjects = subjectRepository.findByCodeAndTeacherId(code, teacher.getId(), PageRequest.of(0, 10)).getContent();
        } else if (name != null && !name.trim().isEmpty()) {
            subjects = subjectRepository.findByTeacherIdAndNameIgnoreCaseContaining(teacher.getId(), name.trim(), PageRequest.of(0, 10)).getContent();
        } else {
            subjects = subjectRepository.findByTeacherId(teacher.getId(), PageRequest.of(0, 10)).getContent();
        }
        List<SubjectDto> subjectDtos = subjects.stream()
                .map(subject -> new SubjectDto(subject.getId(), subject.getName(), subject.getCode()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(subjectDtos);
    }
    
    @GetMapping("/subjects/{subjectId}/students")
    public ResponseEntity<List<StudentDto>> getEnrolledStudents(@PathVariable Long subjectId) {
        String username = getCurrentUsername();
        Teacher teacher = teacherRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher not found"));
        
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subject not found"));
        
        if (!subject.getTeacher().getId().equals(teacher.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only view students in your own subjects");
        }
        
        List<StudentDto> studentDtos = subject.getEnrolledStudents().stream()
                .map(student -> new StudentDto(
                        student.getId(),
                        student.getUser().getUsername(),
                        student.getUser().getFirstName(),
                        student.getUser().getLastName()
                ))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(studentDtos);
    }
    
    @PostMapping("/subjects/{subjectId}/students/{studentId}")
    public ResponseEntity<Void> enrollStudent(@PathVariable Long subjectId, @PathVariable Long studentId) {
        String username = getCurrentUsername();
        Teacher teacher = teacherRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher not found"));
        
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subject not found"));
        
        if (!subject.getTeacher().getId().equals(teacher.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only enroll students in your own subjects");
        }
        
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
        
        // Check if student is already enrolled
        boolean isAlreadyEnrolled = student.getEnrolledSubjects().stream()
                .anyMatch(s -> s.getId().equals(subjectId));
        
        if (isAlreadyEnrolled) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Student is already enrolled in this subject");
        }
        
        // Enroll the student
        student.addSubject(subject);
        studentRepository.save(student);
        
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/subjects/{subjectId}/students/{studentId}")
    public ResponseEntity<Void> removeStudent(@PathVariable Long subjectId, @PathVariable Long studentId) {
        String username = getCurrentUsername();
        Teacher teacher = teacherRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher not found"));
        
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Subject not found"));
        
        if (!subject.getTeacher().getId().equals(teacher.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only remove students from your own subjects");
        }
        
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
        
        // Check if student is enrolled
        boolean isEnrolled = student.getEnrolledSubjects().stream()
                .anyMatch(s -> s.getId().equals(subjectId));
        
        if (!isEnrolled) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student is not enrolled in this subject");
        }
        
        // Remove the student
        student.removeSubject(subject);
        studentRepository.save(student);
        
        return ResponseEntity.ok().build();
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
    
    @GetMapping("/students/search")
    public ResponseEntity<List<StudentDto>> searchStudents(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String firstName,
            @RequestParam(required = false) String lastName) {
        List<Student> students = new ArrayList<>();
        if (id != null) {
            studentRepository.findById(id).ifPresent(students::add);
        } else if (firstName != null && !firstName.trim().isEmpty()) {
            students = studentRepository.findByUserFirstNameContainingIgnoreCase(firstName.trim(), PageRequest.of(0, 10)).getContent();
        } else if (lastName != null && !lastName.trim().isEmpty()) {
            students = studentRepository.findByUserLastNameContainingIgnoreCase(lastName.trim(), PageRequest.of(0, 10)).getContent();
        }
        List<StudentDto> studentDtos = students.stream()
                .map(student -> new StudentDto(
                        student.getId(),
                        student.getUser().getUsername(),
                        student.getUser().getFirstName(),
                        student.getUser().getLastName()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(studentDtos);
    }
    
    @GetMapping("/students/{studentId}/subjects")
    public ResponseEntity<List<SubjectDto>> getStudentSubjects(@PathVariable Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));
        
        List<SubjectDto> subjectDtos = student.getEnrolledSubjects().stream()
                .map(subject -> new SubjectDto(subject.getId(), subject.getName(), subject.getCode()))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(subjectDtos);
    }

    @GetMapping("/students/{studentId}/grades")
    public ResponseEntity<List<GradeDto>> getStudentGrades(@PathVariable Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found");
        }
        
        List<Grade> grades = gradeRepository.findByStudentId(studentId);
        
        List<GradeDto> gradeDtos = grades.stream()
                .map(grade -> {
                    SubjectDto subjectDto = new SubjectDto(
                            grade.getSubject().getId(),
                            grade.getSubject().getName(),
                            grade.getSubject().getCode()
                    );
                    GradeDto gradeDto = new GradeDto(grade.getId(), grade.getValue(), grade.getDateAssigned());
                    gradeDto.setSubject(subjectDto);
                    return gradeDto;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(gradeDtos);
    }
    
    @DeleteMapping("/grades/{gradeId}")
    public ResponseEntity<Void> deleteGrade(@PathVariable Long gradeId) {
        String username = getCurrentUsername();
        Teacher teacher = teacherRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Teacher not found"));

        Grade grade = gradeRepository.findById(gradeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grade not found"));

        if (!grade.getSubject().getTeacher().getId().equals(teacher.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete grades for your own subjects.");
        }

        gradeRepository.delete(grade);
        
        return ResponseEntity.noContent().build();
    }
    
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        return authentication.getName();
    }
} 