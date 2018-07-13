gcloud config set project yummy-phoenix-graphql
gcloud config set compute/zone europe-west1-d
gcloud components update
gcloud container clusters create staging --enable-autoupgrade --machine-type=g1-small --num-nodes=1
gcloud container clusters get-credentials staging