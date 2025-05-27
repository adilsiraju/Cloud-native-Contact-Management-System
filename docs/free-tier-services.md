# IBM Cloud Free Tier Services Used

This document lists all the IBM Cloud services used in this project, confirming they are all within the free tier and do not require a credit card.

## 1. IBM Cloud Kubernetes Service (IKS)
- **Plan**: Free Cluster
- **Resources**: 1 worker node, 2 vCPU, 4GB RAM
- **Duration**: Free for 30 days, then cluster deleted
- **Limitations**: Single-zone, no load balancer, no persistent storage
- **Perfect for**: Development, testing, learning Kubernetes

## 2. IBM Cloudant
- **Plan**: Lite
- **Storage**: 1GB
- **Throughput**: 20 requests/second
- **Features**: Full Cloudant functionality, HTTP API, replication
- **Limitations**: Storage and throughput caps
- **Perfect for**: Small applications, prototypes, development

## 3. IBM Cloud Container Registry (ICR)
- **Plan**: Free tier
- **Storage**: 500MB
- **Bandwidth**: 5GB/month outbound
- **Features**: Private Docker registry, vulnerability scanning
- **Limitations**: Storage and bandwidth caps
- **Perfect for**: Storing container images for small projects

## 4. IBM Cloud Monitoring
- **Plan**: Lite
- **Metrics**: Basic platform metrics
- **Retention**: 15 days
- **Features**: Dashboards, basic alerting
- **Limitations**: Limited metrics and retention
- **Perfect for**: Basic monitoring and observability

## Total Cost: $0.00 USD

All services listed above are completely free and do not require any payment method or credit card to be associated with your IBM Cloud account.

## Free Tier Limits Summary

| Service | Storage | Compute | Network | Duration |
|---------|---------|---------|---------|----------|
| Kubernetes | None | 2 vCPU, 4GB RAM | Included | 30 days |
| Cloudant | 1GB | 20 req/sec | Included | Unlimited |
| Container Registry | 500MB | Included | 5GB/month | Unlimited |
| Monitoring | 15 days retention | Included | Included | Unlimited |

## Setting Up Without Credit Card

1. **Create IBM Cloud Account**
   - Visit [ibm.com/cloud](https://www.ibm.com/cloud)
   - Click "Create a free account"
   - Use email verification (no credit card required)

2. **Verify Free Services**
   - All services should show "Free" or "Lite" plan
   - No billing information required
   - Account dashboard shows $0.00 usage

3. **Resource Creation**
   - Only select "Lite" or "Free" plans
   - Avoid any service marked with pricing
   - Monitor usage in account dashboard

## Best Practices for Free Tier

1. **Monitor Usage Regularly**
   - Check IBM Cloud dashboard weekly
   - Set up basic alerts if available
   - Watch for any unexpected charges

2. **Clean Up Resources**
   - Delete unused clusters after 30 days
   - Remove old container images to stay under 500MB
   - Clean up test databases regularly

3. **Optimize Resource Usage**
   - Use minimal container sizes
   - Implement efficient database queries
   - Monitor application performance

4. **Plan for Growth**
   - Understand upgrade paths to paid plans
   - Know when you might exceed free limits
   - Have a backup plan for data migration

## Important Notes

- **Kubernetes Free Cluster**: Automatically deleted after 30 days
- **No Persistent Storage**: Data is lost when cluster is deleted
- **Single Worker Node**: Limited availability and no auto-scaling
- **Rate Limits**: Cloudant enforces 20 requests/second limit
- **Storage Limits**: Both database and registry have storage caps

This setup is perfect for:
- Learning cloud-native development
- Building prototypes and demos
- Development and testing environments
- Small personal projects
- Educational purposes

For production workloads, you would need to upgrade to paid plans with:
- Multi-zone clusters
- Persistent storage
- Load balancers
- Higher throughput limits
- Extended monitoring and logging
