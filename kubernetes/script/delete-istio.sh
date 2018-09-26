#!/bin/bash

echo "Deleting istio components..."
array=( istio istio-crd istio-grafana istio-prometheus istio-jaeger )
for i in "${array[@]}"
do
 	echo " - Removing: $i"
	helm del --purge $i
done

echo "Removing all custom resource definitions..."
kubectl get crd | grep -i istio | awk '{print $1}' | xargs -n 1 kubectl delete crd

echo "Deleting istio namespace..."
kubectl delete --cascade namespace istio-system

echo "Removing all istio secrets..."
kubectl get secrets --all-namespaces | grep "istio\." | awk '{print "kubectl delete secret -n "$1" "$2}' | bash -

echo "Removing mutating webhook stuff..."
kubectl delete MutatingWebhookConfiguration istio-sidecar-injector