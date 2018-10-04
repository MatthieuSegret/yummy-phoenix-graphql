#!/bin/bash

######################
##### Create Cluster
######################

gcloud config set project yummy-phoenix-graphql
gcloud config set compute/zone europe-west1-d
gcloud components update
gcloud container clusters create staging --enable-autoupgrade --machine-type=n1-standard-1 --num-nodes=3 --preemptible
gcloud container clusters get-credentials staging

# Grant cluster admin permissions to the current user.
kubectl create clusterrolebinding cluster-admin-binding \
  --clusterrole=cluster-admin \
  --user="$(gcloud config get-value core/account)"

#################
##### Setup Helm
#################

#  Create a service account that Tiller, the server side of Helm, can use for deploying your charts
kubectl create serviceaccount tiller --namespace kube-system

#  Grant the Tiller service account the cluster-admin role in your cluster
kubectl create clusterrolebinding tiller-admin-binding --clusterrole=cluster-admin --serviceaccount=kube-system:tiller

#  Initialize Helm to install Tiller in your cluster
helm init --service-account=tiller --wait

####################
##### Install Istio
####################

ISTIO_PATH=$(find kubernetes/istio/charts -type d -iname "istio-1.*" | head -1)
cd $ISTIO_PATH

GRAFANA_PASSWORD=$(openssl rand -hex 12)
# GRAFANA_PERSIST is false by default
if [ -z "${GRAFANA_PERSIST}" ]; then 
  GRAFANA_PERSIST=false
fi

# https://github.com/istio/istio/issues/8594
#
# If you change GRAFANA_PERSIST to true, you must edit the grafana deployment : /install/kubernetes/helm/istio/charts/grafana/templates/deployment.yaml
# and add securityContext to pod template spec :
# securityContext:
#   runAsUser: 472
#   fsGroup: 472

kubectl create namespace istio-system
helm install install/kubernetes/helm/istio --wait --name istio --namespace istio-system \
  --set grafana.enabled=true \
  --set grafana.security.enabled=true \
  --set grafana.security.adminPassword=$GRAFANA_PASSWORD \
  --set grafana.persist=$GRAFANA_PERSIST
cd -


##############################
##### Create Grafana dashboard
##############################

./kubernetes/script/create-dashboards.sh kubernetes/grafana/

#######################
##### Setup environment
#######################

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
  if [ ! -e transaction.yaml ]; then
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

helm install --wait --name yummy --namespace=$NAMESPACE \
  --set host=$HOST_OR_IP \
  --set api.sendgridApiKey=$SENDGRID_API_KEY \
  --set api.s3Key=$S3_KEY \
  --set api.s3Secret=$S3_SECRET \
  --set api.s3Bucket=$S3_BUCKET \
  ./kubernetes/yummy


######################################
##### Create and populate the Database
######################################

# Get API pod
API_POD=$(kubectl get pod --selector app=api --output json | jq -r '.items[0].metadata.name')

# Create and migrate database
kubectl exec -it $API_POD -- /opt/app/bin/yummy migrate

# Populate database
kubectl exec -it $API_POD -- /opt/app/bin/yummy seeds

