#######################
##### Setup environment
#######################

ROOT_PROJECT=$(pwd)
NAMESPACE=yummy-staging
INGRESS_IP=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

# Create namespace
kubectl create namespace $NAMESPACE
kubectl label namespace yummy-staging istio-injection=enabled

# Create new context
kubectl config set-context $(kubectl config current-context) --namespace=$NAMESPACE

if [ -z "${HOST}" ]; then 
  HOST_OR_IP=${INGRESS_IP}
else 
  HOST_OR_IP=${HOST}
  if [ ! -e $ROOT_PROJECT/transaction.yaml ]; then
    gcloud dns record-sets transaction start --zone yummy-phoenix-graphql
  fi
  gcloud dns record-sets transaction add --zone yummy-phoenix-graphql --name $HOST. --ttl 300 --type A $INGRESS_IP
  gcloud dns record-sets transaction execute --zone yummy-phoenix-graphql
  gcloud dns record-sets transaction start --zone yummy-phoenix-graphql
  gcloud dns record-sets transaction remove --zone yummy-phoenix-graphql --name $HOST. --ttl 300  --type A $INGRESS_IP
fi

####################
##### Install Yummy
####################

helm install --name yummy --namespace=$NAMESPACE \
  --set host=$HOST_OR_IP \
  --set api.sendgridApiKey=$SENDGRID_API_KEY \
  --set api.s3Key=$S3_KEY \
  --set api.s3Secret=$S3_SECRET \
  --set api.s3Bucket=$S3_BUCKET \
  ./kubernetes/yummy