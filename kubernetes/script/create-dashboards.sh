#!/bin/bash

kubectl -n istio-system port-forward $(kubectl -n istio-system get pod -l app=grafana -o jsonpath='{.items[0].metadata.name}') 3000:3000 &
sleep 3

GRAFANA_PASSWORD=$(kubectl get secret grafana -n istio-system -o json | jq -r '.data.password' | base64 --decode)
GRAFANA_KEY=$(curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"apikey", "role": "Admin"}' \
  "http://admin:${GRAFANA_PASSWORD}@localhost:3000/api/auth/keys" | jq -r '.key')

for filename in $1*.json; do
  dashboard=$(cat $filename | jq -r '. + {id: null, uid: null, message: "Add Resources dashboard"}')
  gnetId=$(echo $dashboard | jq -r '.gnetId')
  data='{ "dashboard": '$dashboard', "folderId": 0, "overwrite": true }'

  response=$(curl -X POST \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $GRAFANA_KEY" \
      -d "${data}" \
      http://localhost:3000/api/dashboards/db)

  if [ $gnetId -eq "315" ]; then
    db_id=$(echo $response | jq -r '.id')

    curl -X PUT \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $GRAFANA_KEY" \
      -d '{ "homeDashboardId": '$db_id' }' \
      "http://localhost:3000/api/user/preferences"
  fi
done