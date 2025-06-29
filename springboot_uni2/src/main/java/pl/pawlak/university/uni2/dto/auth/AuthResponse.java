package pl.pawlak.university.uni2.dto.auth;

public class AuthResponse {
    
    private String token;
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String token) {
        this.token = token;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    @Override
    public String toString() {
        return "AuthResponse{" +
                "token='" + token + '\'' +
                '}';
    }
} 