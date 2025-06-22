package pl.pawlak.university.uni2.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateSubjectRequest {
    
    @NotBlank(message = "Subject name is required")
    private String name;
    
    @NotBlank(message = "Subject code is required")
    private String code;
    
    // Constructors
    public CreateSubjectRequest() {}
    
    public CreateSubjectRequest(String name, String code) {
        this.name = name;
        this.code = code;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
    
    @Override
    public String toString() {
        return "CreateSubjectRequest{" +
                "name='" + name + '\'' +
                ", code='" + code + '\'' +
                '}';
    }
} 