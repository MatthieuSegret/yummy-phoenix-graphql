######################
##### Create Cluster
######################

gcloud config set project yummy-phoenix-graphql
gcloud config set compute/zone europe-west1-d
gcloud components update
gcloud container clusters create staging --enable-autoupgrade --machine-type=g1-small --num-nodes=1
gcloud container clusters get-credentials staging

#################
##### Setup Helm
#################

#  Create a service account that Tiller, the server side of Helm, can use for deploying your charts
kubectl create serviceaccount tiller --namespace kube-system

#  Grant the Tiller service account the cluster-admin role in your cluster
kubectl create clusterrolebinding tiller-admin-binding --clusterrole=cluster-admin --serviceaccount=kube-system:tiller

#  Initialize Helm to install Tiller in your cluster
helm init --service-account=tiller
helm update
helm version

#################
##### Environment
#################

# Create namespace
kubectl create namespace $NAMESPACE

# Create new context
kubectl config set-context $(kubectl config current-context) --namespace=$NAMESPACE

# Generate tls certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt -subj "/CN=yummy/O=yummy"
kubectl create secret tls tls-secret --key tls.key --cert tls.crt
rm tls.key tls.crt