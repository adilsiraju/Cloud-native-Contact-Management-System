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
- IBM Cloud CLI
- Docker Desktop
- kubectl
- Node.js (for frontend development)
- Python 3.8+ (for backend development)

### Local Development
1. Clone the repository
2. Set up backend: `cd backend && pip install -r requirements.txt`
3. Set up frontend: `cd frontend && npm install`
4. Configure environment variables
5. Run services: `docker-compose up`

### IBM Cloud Deployment
1. Set up IBM Cloud CLI and authenticate
2. Create Kubernetes cluster
3. Set up Cloudant database
4. Configure Container Registry
5. Build and push Docker images
6. Deploy to Kubernetes

See detailed setup instructions in `/docs/setup-guide.md`

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
