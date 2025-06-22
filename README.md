# Uni2 - University Management System

A full-stack university management system with Spring Boot 3 backend and Angular 17+ frontend.

## Features

### Authentication
- JWT-based authentication
- Role-based access control (STUDENT, TEACHER)
- Protected routes with guards

### Student Dashboard
- View enrolled subjects
- View grades with subject information
- Responsive design with loading states

### Teacher Dashboard
- Create new subjects
- Assign grades to students
- Form validation and error handling

## Backend Setup

### Prerequisites
- Java 17+
- Maven 3.6+
- PostgreSQL

### Database Configuration
Update `springboot_uni2/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/uni2
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Running the Backend
```bash
cd springboot_uni2
mvn spring-boot:run
```

The backend will be available at `http://localhost:8080`

## Frontend Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Running the Frontend
```bash
cd angular_uni2
npm install
npm start
```

The frontend will be available at `http://localhost:4200`

## Testing the Dashboards

### 1. Register Test Users

#### Register a Student
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "student1",
    "email": "student1@uni.edu",
    "password": "password123",
    "role": "STUDENT",
    "indexNumber": "2024001"
  }'
```

#### Register a Teacher
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "teacher1",
    "email": "teacher1@uni.edu",
    "password": "password123",
    "role": "TEACHER"
  }'
```

### 2. Test Student Dashboard

1. Login as a student at `http://localhost:4200/login`
2. Navigate to `/student` dashboard
3. View enrolled subjects and grades (initially empty)

### 3. Test Teacher Dashboard

1. Login as a teacher at `http://localhost:4200/login`
2. Navigate to `/teacher` dashboard
3. Create a new subject:
   - Name: "Mathematics"
   - Code: "MATH101"
4. Assign a grade:
   - Student ID: 1 (from the registered student)
   - Subject ID: 1 (from the created subject)
   - Grade: 4.5

### 4. Verify Student Dashboard Updates

1. Logout and login as the student again
2. Navigate to `/student` dashboard
3. You should now see the enrolled subject and assigned grade

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Student Endpoints
- `GET /api/v1/student/subjects` - Get enrolled subjects
- `GET /api/v1/student/grades` - Get student grades

### Teacher Endpoints
- `POST /api/v1/teacher/subjects` - Create new subject
- `POST /api/v1/teacher/grades` - Assign grade to student

## Security

- All endpoints except `/api/v1/auth/*` require authentication
- JWT tokens are automatically included in requests via AuthInterceptor
- Role-based access control ensures users can only access appropriate endpoints
- Route guards prevent unauthorized access to dashboard pages

## Architecture

### Backend
- Spring Boot 3 with Spring Security
- JPA/Hibernate for data persistence
- PostgreSQL database
- JWT authentication

### Frontend
- Angular 17+ with standalone components
- Reactive forms with validation
- HTTP interceptors for JWT handling
- Route guards for authentication and authorization
- Responsive design with CSS Grid and Flexbox

## File Structure

```
uni2/
├── springboot_uni2/          # Backend application
│   ├── src/main/java/pl/pawlak/university/uni2/
│   │   ├── auth/             # Authentication components
│   │   ├── config/           # Security configuration
│   │   ├── controller/       # REST controllers
│   │   ├── dto/              # Data transfer objects
│   │   ├── model/            # JPA entities
│   │   └── repository/       # Data repositories
│   └── src/main/resources/
│       └── application.properties
└── angular_uni2/             # Frontend application
    ├── src/app/
    │   ├── auth/             # Authentication components
    │   ├── core/             # Services and guards
    │   ├── student/          # Student dashboard
    │   └── teacher/          # Teacher dashboard
    └── package.json
``` 