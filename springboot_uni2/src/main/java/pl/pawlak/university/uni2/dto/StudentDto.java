package pl.pawlak.university.uni2.dto;

public class StudentDto {
    
    private Long id;
    private String indexNumber;
    private String username;
    private String email;
    
    // Constructors
    public StudentDto() {}
    
    public StudentDto(Long id, String indexNumber, String username, String email) {
        this.id = id;
        this.indexNumber = indexNumber;
        this.username = username;
        this.email = email;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getIndexNumber() {
        return indexNumber;
    }
    
    public void setIndexNumber(String indexNumber) {
        this.indexNumber = indexNumber;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    @Override
    public String toString() {
        return "StudentDto{" +
                "id=" + id +
                ", indexNumber='" + indexNumber + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
} 