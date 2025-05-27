# Copilot Instructions for Cloud-Native Contact Management System

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a cloud-native Contact Management System built for IBM Cloud's free-tier services.

## Architecture
- **Backend**: Python Flask REST API
- **Frontend**: React.js application
- **Database**: IBM Cloudant (Lite tier)
- **Containerization**: Docker
- **Orchestration**: IBM Cloud Kubernetes Service (free 1-node cluster)
- **Registry**: IBM Cloud Container Registry
- **Monitoring**: IBM Cloud Monitoring (Lite)

## Development Guidelines
1. Follow cloud-native 12-factor app principles
2. Use environment variables for configuration
3. Implement proper error handling and logging
4. Follow REST API best practices
5. Use semantic versioning for Docker images
6. Implement health checks for Kubernetes probes
7. Follow security best practices (no hardcoded credentials)

## IBM Cloud Free Tier Constraints
- Keep resource usage minimal
- Use Lite/free plans only
- Optimize for single-node Kubernetes cluster
- Monitor usage to stay within free limits

## Code Style
- Python: Follow PEP 8 standards
- JavaScript/React: Use ES6+ features and functional components
- Use meaningful variable and function names
- Add proper documentation and comments
