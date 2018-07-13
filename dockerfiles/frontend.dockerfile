# Stage 1 - the build process
FROM registry.gitlab.com/matthieusegret/yummy-phoenix-graphql/node:8.11.3 as build

WORKDIR /app
ENV PROD=true
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/ ./
RUN npm run build


# Stage 2 - the production environment
FROM nginx:1.15.0-alpine

COPY --from=build /app/build /usr/share/nginx/html/
RUN rm /etc/nginx/conf.d/default.conf
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]