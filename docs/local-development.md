# Local Development Guide

This guide helps you set up and run the Contact Management System locally for development.

## Prerequisites

- **Node.js 18+** (for frontend)
- **Python 3.8+** (for backend)
- **Docker Desktop** (for containerized development)
- **Git** (for version control)

## Quick Start with Docker Compose

### 1. Clone and Setup
```bash
git clone <repository-url>
cd cloud-native-contact-management
```

### 2. Environment Configuration
```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit backend/.env with your Cloudant credentials (optional for local development)
# Without Cloudant, the app will use in-memory storage
```

### 3. Run with Docker Compose
```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Manual Development Setup

### Backend Setup (Python Flask)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables (optional)
export CLOUDANT_URL=your-cloudant-url
export CLOUDANT_API_KEY=your-api-key
export CLOUDANT_DATABASE=contacts_db

# Run development server
python app.py
```

The backend will be available at http://localhost:5000

### Frontend Setup (React)

```bash
# Navigate to frontend directory (in new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will be available at http://localhost:3000

## API Testing

### Using curl

```bash
# Health check
curl http://localhost:5000/api/health

# Get all contacts
curl http://localhost:5000/api/contacts

# Create a contact
curl -X POST http://localhost:5000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-234-567-8900",
    "company": "Example Corp"
  }'

# Update a contact
curl -X PUT http://localhost:5000/api/contacts/{contact-id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john.smith@example.com",
    "phone": "+1-234-567-8900",
    "company": "Example Corp"
  }'

# Delete a contact
curl -X DELETE http://localhost:5000/api/contacts/{contact-id}
```

### Using Postman

Import the following collection:

```json
{
  "info": {
    "name": "Contact Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": "{{base_url}}/api/health"
      }
    },
    {
      "name": "Get All Contacts",
      "request": {
        "method": "GET",
        "header": [],
        "url": "{{base_url}}/api/contacts"
      }
    },
    {
      "name": "Create Contact",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Jane Doe\",\n  \"email\": \"jane@example.com\",\n  \"phone\": \"+1-555-123-4567\",\n  \"company\": \"Tech Corp\"\n}"
        },
        "url": "{{base_url}}/api/contacts"
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000"
    }
  ]
}
```

## Development Workflow

### 1. Making Changes

#### Backend Changes
- Edit files in `backend/` directory
- Flask will auto-reload in development mode
- Check logs in terminal for any errors

#### Frontend Changes
- Edit files in `frontend/src/` directory
- React will auto-reload and hot-reload changes
- Check browser console for any errors

### 2. Testing

#### Backend Tests
```bash
cd backend
python -m pytest tests/ -v
```

#### Frontend Tests
```bash
cd frontend
npm test
```

### 3. Code Quality

#### Python (Backend)
```bash
# Install development dependencies
pip install flake8 black pytest

# Format code
black backend/

# Lint code
flake8 backend/

# Run tests
pytest backend/tests/
```

#### JavaScript/React (Frontend)
```bash
# Lint code
npm run lint

# Format code (if prettier is configured)
npm run format

# Run tests
npm test
```

## Database Development

### Local Development Without Cloudant
The application will use in-memory storage when Cloudant credentials are not provided. This is perfect for local development and testing.

### Local Development With Cloudant
1. Create a free IBM Cloud account
2. Create a Cloudant service instance (Lite plan)
3. Get service credentials
4. Add credentials to `backend/.env`

### Database Schema
Contacts are stored as JSON documents:
```json
{
  "_id": "unique-contact-id",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-234-567-8900",
  "company": "Example Corp",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z"
}
```

## Docker Development

### Building Images Locally
```bash
# Build backend image
cd backend
docker build -t contact-backend:dev .

# Build frontend image
cd ../frontend
docker build -t contact-frontend:dev .
```

### Running Individual Containers
```bash
# Run backend
docker run -p 5000:5000 --env-file backend/.env contact-backend:dev

# Run frontend
docker run -p 3000:80 contact-frontend:dev
```

## Environment Variables

### Backend (.env)
```bash
# IBM Cloudant Configuration
CLOUDANT_URL=https://your-account.cloudantnosqldb.appdomain.cloud
CLOUDANT_API_KEY=your-cloudant-api-key
CLOUDANT_DATABASE=contacts_db

# Flask Configuration
FLASK_ENV=development
PORT=5000
SECRET_KEY=your-development-secret-key
```

### Frontend
```bash
# Create frontend/.env.local
REACT_APP_API_URL=http://localhost:5000/api
```

## Debugging

### Backend Debugging
```bash
# Enable debug mode
export FLASK_ENV=development
export FLASK_DEBUG=1
python app.py
```

### Frontend Debugging
- Use browser developer tools
- React Developer Tools extension
- Check console for errors and warnings

### Container Debugging
```bash
# Check container logs
docker-compose logs backend
docker-compose logs frontend

# Execute shell in container
docker-compose exec backend bash
docker-compose exec frontend sh
```

## Performance Optimization

### Backend
- Use gunicorn in production (already configured in Dockerfile)
- Enable gzip compression
- Implement caching for frequent queries
- Use connection pooling for database

### Frontend
- Lazy loading for components
- Optimize bundle size
- Enable compression in nginx
- Use CDN for static assets

## Security Considerations

### Development
- Never commit real credentials to version control
- Use `.env` files for secrets (already in `.gitignore`)
- Validate all input data
- Use HTTPS in production

### Production
- Use secrets management (Kubernetes secrets)
- Enable CORS properly
- Implement rate limiting
- Regular security updates

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process using port
   # Windows:
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # macOS/Linux:
   lsof -ti:5000 | xargs kill -9
   ```

2. **Python/Node version issues**
   ```bash
   # Check versions
   python --version
   node --version
   npm --version
   ```

3. **Docker issues**
   ```bash
   # Clean up Docker
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

4. **CORS errors**
   - Check backend CORS configuration
   - Ensure frontend proxy is set correctly

## Next Steps

1. Add unit tests for all components
2. Implement integration tests
3. Set up code coverage reporting
4. Add API documentation with Swagger
5. Implement authentication and authorization
6. Add real-time features with WebSockets
7. Implement caching strategies
8. Add monitoring and logging
