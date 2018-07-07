#!/usr/bin/env sh

#################
##### Environment
#################

# Create yummy-dev namespace
kubectl apply -f kubernetes/minikube/local-namespace.yaml

# Create new context
kubectl config set-context yummy-dev --namespace=yummy-dev --cluster=minikube --user=minikube

# Use this context as default
kubectl config use-context yummy-dev

# Define config for minikube
kubectl apply -f kubernetes/minikube/

# Add secret key to pull images from private registry
kubectl create secret docker-registry gitlab-registry \
  --docker-server=$REGISTRY_SERVER \
  --docker-username=$REGISTRY_USERNAME \
  --docker-password=$REGISTRY_PASSWORD \
  --docker-email=$REGISTRY_EMAIL \
  --namespace=yummy-dev

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

# Create postgres config, pvc, deployement and service
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

# Migrate database
kubectl exec -it api-deploy-79c69f7f96-rf6nk -- /opt/app/bin/yummy migrate
kubectl exec -it api-deploy-79c69f7f96-rf6nk -- /opt/app/bin/yummy seeds

# Check resources
kubectl get all