package pl.pawlak.university.uni2.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.pawlak.university.uni2.dto.UserDto;
import pl.pawlak.university.uni2.dto.auth.AuthResponse;
import pl.pawlak.university.uni2.dto.auth.LoginRequest;
import pl.pawlak.university.uni2.dto.auth.RegisterRequest;
import pl.pawlak.university.uni2.model.Student;
import pl.pawlak.university.uni2.model.StudentUser;
import pl.pawlak.university.uni2.model.Teacher;
import pl.pawlak.university.uni2.model.TeacherUser;
import pl.pawlak.university.uni2.model.User;
import pl.pawlak.university.uni2.model.UserRole;
import pl.pawlak.university.uni2.repository.StudentRepository;
import pl.pawlak.university.uni2.repository.TeacherRepository;
import pl.pawlak.university.uni2.repository.UserRepository;

@Service
public class AuthService {
    
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final AuthenticationManager authenticationManager;
    
    public AuthService(UserRepository userRepository,
                      StudentRepository studentRepository,
                      TeacherRepository teacherRepository,
                      PasswordEncoder passwordEncoder,
                      JwtProvider jwtProvider,
                      AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
        this.authenticationManager = authenticationManager;
    }
    
    public AuthResponse register(RegisterRequest request) {
        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        
        User savedUser;
        
        // Create user based on role
        if (request.getRole() == UserRole.STUDENT) {
            StudentUser studentUser = new StudentUser(
                    request.getUsername(),
                    passwordEncoder.encode(request.getPassword()),
                    request.getFirstName(),
                    request.getLastName()
            );
            savedUser = userRepository.save(studentUser);
            
            Student student = new Student(savedUser);
            studentRepository.save(student);
        } else if (request.getRole() == UserRole.TEACHER) {
            TeacherUser teacherUser = new TeacherUser(
                    request.getUsername(),
                    passwordEncoder.encode(request.getPassword()),
                    request.getFirstName(),
                    request.getLastName()
            );
            savedUser = userRepository.save(teacherUser);
            
            Teacher teacher = new Teacher(savedUser);
            teacherRepository.save(teacher);
        } else {
            throw new RuntimeException("Invalid role");
        }
        
        // Generate JWT token
        String token = jwtProvider.generateToken(savedUser);
        return new AuthResponse(token);
    }
    
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String token = jwtProvider.generateToken(user);
        return new AuthResponse(token);
    }
    
    public UserDto getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole()
        );
    }
} 