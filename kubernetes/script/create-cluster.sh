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
helm init --service-account=tiller
helm repo update
sleep 10

####################
##### Install Istio
####################

ISTIO_PATH=$(find kubernetes/istio/charts -type d -iname "istio-1.*" | head -1)
cd $ISTIO_PATH
kubectl create namespace istio-system
helm install install/kubernetes/helm/istio --name istio --namespace istio-system
helm upgrade istio install/kubernetes/helm/istio \
  --set grafana.enabled=true
cd -