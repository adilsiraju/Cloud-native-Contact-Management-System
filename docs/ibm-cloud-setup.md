# IBM Cloud Setup Guide

This guide walks you through setting up the Cloud-Native Contact Management System on IBM Cloud using only free-tier services.

## Prerequisites

- IBM Cloud account (free, no credit card required)
- Git installed locally
- Docker Desktop installed
- Node.js 18+ and Python 3.8+ for local development

## Step 1: Install IBM Cloud CLI

### Windows (PowerShell)
```powershell
# Download and install IBM Cloud CLI
iex (New-Object Net.WebClient).DownloadString('https://clis.cloud.ibm.com/install/powershell')
```

### macOS
```bash
curl -fsSL https://clis.cloud.ibm.com/install/osx | sh
```

### Linux
```bash
curl -fsSL https://clis.cloud.ibm.com/install/linux | sh
```

### Verify Installation
```bash
ibmcloud --version
ibmcloud plugin install container-registry
ibmcloud plugin install kubernetes-service
```

## Step 2: IBM Cloud Authentication

```bash
# Login to IBM Cloud
ibmcloud login

# Target your resource group (usually 'Default' for free accounts)
ibmcloud target -g Default

# Set region (us-south is recommended for free tier)
ibmcloud target -r us-south
```

## Step 3: Create IBM Cloudant Database (Lite Tier)

### Using IBM Cloud CLI
```bash
# Create Cloudant service instance (Lite plan - FREE)
ibmcloud resource service-instance-create contact-cloudant cloudantnosqldb lite us-south

# Create service credentials
ibmcloud resource service-key-create cloudant-credentials Manager --instance-name contact-cloudant

# Get credentials
ibmcloud resource service-key cloudant-credentials
```

### Using IBM Cloud Console
1. Go to [IBM Cloud Catalog](https://cloud.ibm.com/catalog)
2. Search for "Cloudant"
3. Select **Cloudant** service
4. Choose **Lite** plan (FREE)
5. Set instance name: `contact-cloudant`
6. Click **Create**
7. Go to **Service credentials** → **New credential**
8. Name: `cloudant-credentials`, Role: **Manager**
9. Click **Add**

### Note Down Credentials
Save these values for later:
- `url`: Your Cloudant URL
- `apikey`: Your API key

## Step 4: Create Kubernetes Cluster (Free Tier)

```bash
# Create free Kubernetes cluster (takes 15-30 minutes)
ibmcloud ks cluster create classic --name contact-cluster --location dal10 --machine-type free --workers 1

# Check cluster status
ibmcloud ks clusters

# Wait until cluster state is 'normal'
ibmcloud ks cluster get --cluster contact-cluster

# Configure kubectl
ibmcloud ks cluster config --cluster contact-cluster

# Verify connection
kubectl get nodes
```

## Step 5: Set Up Container Registry

```bash
# Create a namespace in Container Registry (FREE tier: 500MB)
ibmcloud cr namespace-add contact-management

# Login to Container Registry
ibmcloud cr login

# List namespaces to verify
ibmcloud cr namespaces
```

## Step 6: Build and Push Docker Images

### Clone the Repository
```bash
git clone <your-repo-url>
cd cloud-native-contact-management
```

### Build Backend Image
```bash
cd backend
docker build -t us.icr.io/contact-management/backend:v1.0.0 .
docker push us.icr.io/contact-management/backend:v1.0.0
```

### Build Frontend Image
```bash
cd ../frontend
docker build -t us.icr.io/contact-management/frontend:v1.0.0 .
docker push us.icr.io/contact-management/frontend:v1.0.0
```

### Verify Images
```bash
ibmcloud cr images --restrict contact-management
```

## Step 7: Create Kubernetes Secrets

### Encode Cloudant Credentials
```bash
# Base64 encode your credentials (replace with actual values)
echo -n "your-cloudant-url" | base64
echo -n "your-cloudant-apikey" | base64
```

### Update secrets-config.yaml
Edit `k8s/secrets-config.yaml` and replace the encoded values:
```yaml
data:
  url: <your-base64-encoded-url>
  apikey: <your-base64-encoded-apikey>
```

## Step 8: Deploy to Kubernetes

```bash
# Apply secrets and config
kubectl apply -f k8s/secrets-config.yaml

# Deploy backend
kubectl apply -f k8s/backend-deployment.yaml

# Deploy frontend
kubectl apply -f k8s/frontend-deployment.yaml

# Apply ingress (optional)
kubectl apply -f k8s/ingress.yaml

# Check deployments
kubectl get deployments
kubectl get pods
kubectl get services
```

## Step 9: Access Your Application

### Option 1: NodePort (Recommended for Free Tier)
```bash
# Get external IP of your worker node
ibmcloud ks workers --cluster contact-cluster

# Access application at: http://<EXTERNAL-IP>:30080
```

### Option 2: Ingress (If Available)
```bash
# Get ingress details
kubectl get ingress

# Access via the provided URL
```

### Option 3: Port Forward (Development)
```bash
# Port forward frontend service
kubectl port-forward service/frontend-service 8080:80

# Access at: http://localhost:8080
```

## Step 10: Set Up Monitoring (Optional)

### Create IBM Cloud Monitoring Instance
```bash
# Create monitoring service (Lite plan - FREE)
ibmcloud resource service-instance-create contact-monitoring logdnaat lite us-south

# Bind to cluster
ibmcloud ks cluster addon enable logdna --cluster contact-cluster
```

## Resource Usage Monitoring

### Free Tier Limits to Monitor:
- **Kubernetes**: 1 worker node, 2 vCPU, 4GB RAM
- **Cloudant**: 1GB storage, 20 requests/second
- **Container Registry**: 500MB storage
- **Monitoring**: Basic metrics only

### Check Usage:
```bash
# Check cluster resources
kubectl top nodes
kubectl top pods

# Check Cloudant usage in IBM Cloud console
ibmcloud resource service-instances --service-name cloudantnosqldb

# Check container registry usage
ibmcloud cr quota
```

## Troubleshooting

### Common Issues:

1. **Cluster Creation Fails**
   - Ensure you're using `dal10` location for free tier
   - Check your account limits

2. **Image Push Fails**
   ```bash
   ibmcloud cr login
   ibmcloud cr namespace-add contact-management
   ```

3. **Pods Not Starting**
   ```bash
   kubectl describe pod <pod-name>
   kubectl logs <pod-name>
   ```

4. **Database Connection Issues**
   - Verify Cloudant credentials in secrets
   - Check service instance status

### Useful Commands:
```bash
# Check all resources
kubectl get all

# Debug pod issues
kubectl describe pod <pod-name>
kubectl logs <pod-name> -f

# Check cluster status
ibmcloud ks cluster get --cluster contact-cluster

# Reset cluster config
ibmcloud ks cluster config --cluster contact-cluster --admin
```

## Cost Optimization Tips

1. **Use resource limits** in deployment files
2. **Monitor usage** regularly via IBM Cloud console
3. **Delete unused resources** to stay within free limits
4. **Use single replicas** for free tier
5. **Clean up old container images** regularly

## Next Steps

1. Set up CI/CD with GitHub Actions (see `.github/workflows/ci-cd.yaml`)
2. Configure custom domain (requires paid plan)
3. Add SSL/TLS certificates
4. Implement additional monitoring and logging
5. Set up backup strategies for Cloudant

## Support

- [IBM Cloud Docs](https://cloud.ibm.com/docs)
- [Kubernetes Service Docs](https://cloud.ibm.com/docs/containers)
- [Cloudant Docs](https://cloud.ibm.com/docs/Cloudant)
- [Free Tier Details](https://www.ibm.com/cloud/free)
