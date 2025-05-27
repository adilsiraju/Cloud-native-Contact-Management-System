# Architecture Documentation

## System Overview

The Cloud-Native Contact Management System is built using a microservices architecture designed to run on IBM Cloud's free-tier services. The system follows cloud-native principles including containerization, orchestration, and scalability.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        IBM Cloud Platform                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────── │
│  │   Users/Client  │    │   Load Balancer │    │   IBM Cloud   │
│  │   (Browser)     │────│   (Ingress)     │    │  Monitoring   │
│  └─────────────────┘    └─────────────────┘    └─────────────── │
│           │                       │                            │
│           └───────────────────────┼────────────────────────────┘
│                                   │
│  ┌─────────────────────────────────────────────────────────────┐
│  │            Kubernetes Cluster (IKS Free Tier)              │
│  │                                                             │
│  │  ┌─────────────────┐         ┌─────────────────┐           │
│  │  │   Frontend Pod  │         │   Backend Pod   │           │
│  │  │                 │         │                 │           │
│  │  │  ┌─────────────┐│         │ ┌─────────────┐ │           │
│  │  │  │    React    ││         │ │    Flask    │ │           │
│  │  │  │    App      ││         │ │    API      │ │           │
│  │  │  │  (Nginx)    ││         │ │  (Gunicorn) │ │           │
│  │  │  └─────────────┘│         │ └─────────────┘ │           │
│  │  │   Port: 80      │         │   Port: 5000    │           │
│  │  └─────────────────┘         └─────────────────┘           │
│  │           │                           │                    │
│  │           └───────────────────────────┘                    │
│  │                          │                                 │
│  └──────────────────────────┼─────────────────────────────────┘
│                             │
│  ┌─────────────────────────────────────────────────────────────┐
│  │                    Data Layer                               │
│  │                                                             │
│  │         ┌─────────────────────────────────────┐             │
│  │         │        IBM Cloudant                 │             │
│  │         │      (NoSQL Database)               │             │
│  │         │        Lite Tier                    │             │
│  │         │      1GB Storage                    │             │
│  │         │    20 req/sec limit                 │             │
│  │         └─────────────────────────────────────┘             │
│  └─────────────────────────────────────────────────────────────┘
│
│  ┌─────────────────────────────────────────────────────────────┐
│  │                   DevOps & CI/CD                            │
│  │                                                             │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  │   GitHub    │  │   Docker    │  │    GitHub Actions   │  │
│  │  │ Repository  │  │   Images    │  │      (CI/CD)        │  │
│  │  │             │  │    (ICR)    │  │                     │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│  └─────────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Layer (React.js)
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ContactForm.js   # Contact creation/editing form
│   │   ├── ContactList.js   # Display list of contacts
│   │   └── SearchBar.js     # Search functionality
│   ├── services/            # API communication layer
│   │   └── contactService.js # HTTP client for backend API
│   ├── App.js              # Main application component
│   └── index.js            # Application entry point
├── public/                 # Static assets
├── Dockerfile             # Container configuration
└── nginx.conf             # Web server configuration
```

**Responsibilities:**
- User interface rendering
- Form validation and user input handling
- API communication with backend
- Client-side routing and state management
- Responsive design for multiple device types

### Backend Layer (Flask API)
```
backend/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── Dockerfile            # Container configuration
└── .env.example          # Environment variables template
```

**Responsibilities:**
- RESTful API endpoints
- Business logic processing
- Data validation and sanitization
- Database operations (CRUD)
- Error handling and logging
- Health checks for Kubernetes

### Data Layer (IBM Cloudant)

**Database Schema:**
```json
{
  "_id": "unique-contact-id",
  "_rev": "revision-id",
  "name": "string",
  "email": "string",
  "phone": "string (optional)",
  "company": "string (optional)",
  "created_at": "ISO timestamp",
  "updated_at": "ISO timestamp"
}
```

**Responsibilities:**
- Persistent data storage
- ACID compliance for critical operations
- Built-in replication and backup
- REST API for database operations
- Automatic indexing and querying

## API Design

### RESTful Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/health` | Health check | None | `{"status": "healthy"}` |
| GET | `/api/contacts` | Get all contacts | None | `[{contact}, ...]` |
| GET | `/api/contacts/{id}` | Get specific contact | None | `{contact}` |
| POST | `/api/contacts` | Create new contact | `{contact_data}` | `{contact}` |
| PUT | `/api/contacts/{id}` | Update contact | `{contact_data}` | `{contact}` |
| DELETE | `/api/contacts/{id}` | Delete contact | None | `204 No Content` |

### Request/Response Format

**Contact Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-234-567-8900",
  "company": "Example Corp"
}
```

**Contact Response:**
```json
{
  "id": "contact-uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-234-567-8900",
  "company": "Example Corp",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

**Error Response:**
```json
{
  "error": "Error description",
  "code": "ERROR_CODE",
  "details": "Additional error information"
}
```

## Cloud-Native Principles

### 1. Containerization
- **Docker containers** for both frontend and backend
- **Multi-stage builds** for optimized image sizes
- **Non-root users** for security
- **Health checks** built into containers

### 2. Orchestration
- **Kubernetes deployments** for container management
- **Services** for internal communication
- **ConfigMaps and Secrets** for configuration
- **Resource limits** for efficient resource usage

### 3. Scalability
- **Horizontal scaling** via replica sets
- **Load balancing** through Kubernetes services
- **Stateless design** for easy scaling
- **Database connection pooling**

### 4. Observability
- **Health check endpoints** for monitoring
- **Structured logging** with timestamps
- **Metrics collection** via IBM Cloud Monitoring
- **Error tracking** and alerting

### 5. Resilience
- **Graceful error handling** at all layers
- **Circuit breaker patterns** for external dependencies
- **Retry mechanisms** for transient failures
- **Fallback to in-memory storage** when database is unavailable

## Security Architecture

### Authentication & Authorization
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │    │   Backend   │    │  Database   │
│             │    │             │    │             │
│  ┌───────┐  │    │  ┌───────┐  │    │  ┌───────┐  │
│  │ HTTPS │  │────│  │ CORS  │  │────│  │ IAM   │  │
│  └───────┘  │    │  └───────┘  │    │  └───────┘  │
│             │    │             │    │             │
│  ┌───────┐  │    │  ┌───────┐  │    │  ┌───────┐  │
│  │ CSP   │  │    │  │Validation│    │  │ TLS   │  │
│  └───────┘  │    │  └───────┘  │    │  └───────┘  │
└─────────────┘    └─────────────┘    └─────────────┘
```

### Security Layers
1. **Transport Security**: HTTPS/TLS encryption
2. **CORS Protection**: Configured for specific origins
3. **Input Validation**: Server-side validation for all inputs
4. **Content Security Policy**: XSS protection
5. **Secrets Management**: Kubernetes secrets for credentials
6. **Database Security**: IAM-based access control

## Deployment Architecture

### Environment Progression
```
Development → Testing → Staging → Production
     ↓            ↓        ↓          ↓
  Docker      CI Tests   K8s Test   K8s Prod
 Compose                 Cluster    Cluster
```

### Kubernetes Resources

**Deployments:**
- `frontend-deployment`: React application (1 replica)
- `backend-deployment`: Flask API (1 replica)

**Services:**
- `frontend-service`: NodePort for external access
- `backend-service`: ClusterIP for internal communication

**ConfigMaps & Secrets:**
- `app-config`: Application configuration
- `cloudant-credentials`: Database credentials

**Ingress:**
- Routes external traffic to appropriate services
- SSL termination and load balancing

## Data Flow

### User Request Flow
1. **User Action** → Frontend React component
2. **API Call** → contactService.js makes HTTP request
3. **Backend Processing** → Flask route handles request
4. **Data Operation** → Cloudant database query/update
5. **Response** → JSON data returned through layers
6. **UI Update** → React component re-renders with new data

### Error Handling Flow
1. **Error Occurs** → At any layer (UI, API, Database)
2. **Error Capture** → Logged with context and timestamp
3. **Error Response** → Structured error message returned
4. **User Feedback** → Friendly error message displayed
5. **Recovery Action** → Fallback behavior activated if possible

## Performance Considerations

### Frontend Optimization
- **Code splitting** for faster initial load
- **Lazy loading** of components
- **Caching** of API responses
- **Debounced search** to reduce API calls

### Backend Optimization
- **Connection pooling** for database connections
- **Request caching** for frequently accessed data
- **Pagination** for large result sets
- **Compression** for API responses

### Database Optimization
- **Indexes** on frequently queried fields
- **Bulk operations** for multiple updates
- **Query optimization** for complex searches
- **Connection management** to avoid limits

## Monitoring and Observability

### Metrics Collection
```
Application Metrics → IBM Cloud Monitoring → Dashboards & Alerts
     ↓
- Response times
- Error rates  
- Resource usage
- Database connections
```

### Logging Strategy
```
Application Logs → Structured JSON → Central Logging → Analysis
     ↓
- Request/Response logs
- Error logs with stack traces
- Performance metrics
- Security events
```

### Health Checks
- **Liveness Probes**: Container restart on failure
- **Readiness Probes**: Traffic routing control
- **Startup Probes**: Initial container health verification

## Future Enhancements

### Scalability Improvements
1. **Horizontal Pod Autoscaling** based on CPU/memory
2. **Database read replicas** for improved performance
3. **CDN integration** for static asset delivery
4. **Caching layer** with Redis

### Security Enhancements
1. **OAuth 2.0** authentication
2. **API rate limiting** and throttling
3. **Audit logging** for compliance
4. **Vulnerability scanning** in CI/CD

### Feature Additions
1. **Real-time updates** with WebSockets
2. **File attachments** for contacts
3. **Advanced search** and filtering
4. **Bulk operations** for data management
5. **Data export/import** functionality
