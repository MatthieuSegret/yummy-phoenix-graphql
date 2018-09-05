#!/usr/bin/env sh

#################
##### Environment
#################

# Create yummy-dev namespace
kubectl create namespace yummy-staging

# Create new context
kubectl config set-context $(kubectl config current-context) --namespace=yummy-staging

# Define spec for gke, create config, pvc, etc.
kubectl apply -f kubernetes/config.yaml

#################
##### FRONTEND
#################

# Create frontend deployement and service
kubectl apply -f kubernetes/frontend/

#################
##### Database
#################

# Generate postgres password
export POSTGRES_USER=$(openssl rand -hex 12)
export POSTGRES_PASSWORD=$(openssl rand -hex 24)
kubectl create secret generic postgres-credentials --from-literal user=$POSTGRES_USER --from-literal password=$POSTGRES_PASSWORD

# Create postgres config, deployement and service
kubectl apply -f kubernetes/postgres/

###################
##### API Backend
###################

export NODE_COOKIE=$(openssl rand -hex 48)
export SECRET_KEY_BASE=$(openssl rand -hex 48)
kubectl create secret generic api-credentials \
  --from-literal node-cookie=$NODE_COOKIE \
  --from-literal secret-key-base=$SECRET_KEY_BASE \
  --from-literal sendgrid-api-key=$SENDGRID_API_KEY \
  --from-literal s3-key=$S3_KEY \
  --from-literal s3-secret=$S3_SECRET \
  --from-literal s3-bucket=$S3_BUCKET

# Create api backend deployement and service
kubectl apply -f kubernetes/api/

openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt -subj "/CN=yummy/O=yummy"
kubectl create secret tls tls-secret --key tls.key --cert tls.crt
rm tls.key tls.crt

kubectl apply -f kubernetes/ingress.yaml

# Check resources
kubectl get all
kubectl get ingress