# Get API pod
export API_POD=$(kubectl get pod --selector app=api --output json | jq -r '.items[0].metadata.name')

# Create and migrate database
kubectl exec -it $API_POD -- /opt/app/bin/yummy migrate

# Populate database
kubectl exec -it $API_POD -- /opt/app/bin/yummy seeds