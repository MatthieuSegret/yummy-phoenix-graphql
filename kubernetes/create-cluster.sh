#!/usr/bin/env sh

#################
##### Environment
#################

# Create yummy-dev namespace
kubectl create -f kubernetes/minikube/dev-namespace.yaml

# Create new context
kubectl config set-context yummy-dev --namespace=yummy-dev --cluster=minikube --user=minikube

# Use this context as default
kubectl config use-context yummy-dev

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
export POSTGRES_USER=$(openssl rand -hex 32)
export POSTGRES_PASSWORD=$(openssl rand -hex 48)
kubectl create secret generic postgres-credentials --from-literal user=$POSTGRES_USER --from-literal password=$POSTGRES_PASSWORD

# Create postgres config, pvc, deployement and service
kubectl create -f kubernetes/postgres/

# Check resources
kubectl get all