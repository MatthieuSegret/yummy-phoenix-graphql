FROM node:8.11.3-alpine

WORKDIR /app
ENV PROD=true

COPY client/package.json client/package-lock.json ./

RUN npm install