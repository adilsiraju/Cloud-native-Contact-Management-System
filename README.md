# Cloud-Native Contact Management System

A full-stack, cloud-native Contact Management System built using IBM Cloud's free-tier services.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│────│  Flask Backend  │────│ IBM Cloudant DB │
│   (Port 3000)   │    │   (Port 5000)   │    │   (Lite Tier)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ IBM Kubernetes  │
                    │ Service (Free)  │
                    └─────────────────┘
```

## IBM Cloud Services Used (Free Tier)

1. **IBM Cloud Kubernetes Service** - Free single-node cluster
2. **IBM Cloud Container Registry** - Free tier (500MB storage)
3. **IBM Cloudant** - Lite plan (1GB storage, 20 req/sec)
4. **IBM Cloud Monitoring** - Lite plan (basic monitoring)

## Features

- ✅ Add new contacts
- ✅ Update existing contacts
- ✅ View contact details
- ✅ Delete contacts
- ✅ Search and filter contacts
- ✅ RESTful API design
- ✅ Cloud-native architecture
- ✅ Docker containerization
- ✅ Kubernetes deployment
- ✅ CI/CD with GitHub Actions

## Quick Start

### Prerequisites
- Docker Desktop (required)
- Docker Compose (included with Docker Desktop)
- IBM Cloud CLI (for cloud deployment)
- kubectl (for Kubernetes deployment)
- Node.js 16+ (optional, for frontend development)
- Python 3.8+ (optional, for backend development)

### Local Development with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "cloud-native Contact Management System"
   ```

2. **Configure environment variables**
   ```bash
   # Copy the environment template
   cp .env.example .env
   
   # Edit .env file with your IBM Cloudant credentials
   # CLOUDANT_URL=https://your-cloudant-instance.cloudantnosqldb.appdomain.cloud
   # CLOUDANT_API_KEY=your-api-key
   ```

3. **Start the application**
   ```bash
   # Build and start all services
   docker-compose up --build
   
   # Or run in background
   docker-compose up --build -d
   ```

4. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000
   - **API Health Check**: http://localhost:5000/api/health

5. **Stop the application**
   ```bash
   # Stop all services
   docker-compose down
   
   # Stop and remove volumes
   docker-compose down -v
   ```

### Alternative: Manual Development Setup

If you prefer to run services individually for development:

1. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   
   # Set environment variables
   export CLOUDANT_URL="your-cloudant-url"
   export CLOUDANT_API_KEY="your-api-key"
   
   # Run the Flask app
   python app.py
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

### Environment Configuration

Create a `.env` file in the root directory with your IBM Cloudant credentials:

```env
# IBM Cloudant Configuration
CLOUDANT_URL=https://your-instance.cloudantnosqldb.appdomain.cloud
CLOUDANT_API_KEY=your-api-key

# Optional: Development settings
FLASK_ENV=development
DEBUG=True
```

### Troubleshooting

- **Port conflicts**: If ports 3000 or 5000 are in use, modify the ports in `docker-compose.yaml`
- **Docker issues**: Ensure Docker Desktop is running and you have sufficient resources allocated
- **Database connection**: Verify your Cloudant credentials are correct in the `.env` file
- **Build failures**: Try `docker-compose down && docker-compose up --build --force-recreate`

### Testing the Application

1. **Check service status**
   ```bash
   docker-compose ps
   ```

2. **View logs**
   ```bash
   # All services
   docker-compose logs
   
   # Specific service
   docker-compose logs backend
   docker-compose logs frontend
   ```

3. **Test API endpoints**
   ```bash
   # Health check
   curl http://localhost:5000/api/health
   
   # Get all contacts
   curl http://localhost:5000/api/contacts
   
   # Create a new contact
   curl -X POST http://localhost:5000/api/contacts \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com","phone":"123-456-7890"}'
   ```

4. **Frontend testing**
   - Open http://localhost:3000 in your browser
   - Try adding, editing, and deleting contacts
   - Test the search functionality

### VS Code Integration

If you're using Visual Studio Code, you can use the built-in task to start the development environment:

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Tasks: Run Task"
3. Select "Start Development Environment"

This will run `docker-compose up --build` in the integrated terminal.

### IBM Cloud Deployment

For deploying to IBM Cloud's free tier:

1. **Set up IBM Cloud CLI and authenticate**
   ```bash
   # Install IBM Cloud CLI
   # Download from: https://cloud.ibm.com/docs/cli
   
   # Login to IBM Cloud
   ibmcloud login
   
   # Target your resource group
   ibmcloud target -g default
   ```

2. **Create and configure services**
   ```bash
   # Create Cloudant database (Lite plan)
   ibmcloud resource service-instance-create my-cloudant cloudantnosqldb lite us-south
   
   # Create Kubernetes cluster (Free tier)
   ibmcloud ks cluster create classic --name my-cluster --location dal10 --machine-type free --workers 1
   ```

3. **Configure Container Registry**
   ```bash
   # Create namespace
   ibmcloud cr namespace-add my-namespace
   
   # Build and push images
   docker build -t us.icr.io/my-namespace/contact-backend:v1.0 ./backend
   docker build -t us.icr.io/my-namespace/contact-frontend:v1.0 ./frontend
   
   docker push us.icr.io/my-namespace/contact-backend:v1.0
   docker push us.icr.io/my-namespace/contact-frontend:v1.0
   ```

4. **Deploy to Kubernetes**
   ```bash
   # Get cluster config
   ibmcloud ks cluster config --cluster my-cluster
   
   # Apply Kubernetes manifests
   kubectl apply -f k8s/
   ```

See detailed setup instructions in `/docs/ibm-cloud-setup.md`

## Project Structure

```
.
├── backend/                 # Python Flask API
│   ├── app/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── tests/
├── frontend/               # React.js application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── k8s/                    # Kubernetes manifests
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── services.yaml
├── .github/
│   └── workflows/          # CI/CD pipelines
├── docs/                   # Documentation
└── docker-compose.yaml    # Local development
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contacts` | Get all contacts |
| GET | `/api/contacts/{id}` | Get contact by ID |
| POST | `/api/contacts` | Create new contact |
| PUT | `/api/contacts/{id}` | Update contact |
| DELETE | `/api/contacts/{id}` | Delete contact |
| GET | `/api/health` | Health check |

## Contact Schema

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "company": "string",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
