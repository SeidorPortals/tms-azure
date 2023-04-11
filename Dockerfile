#stage 1 
FROM node:latest as node 
WORKDIR /app 
COPY . . 
RUN npm install --force
RUN npm run build 
#para desplegar a PRD
#RUN npm run build --prod 
#stage 2 
FROM nginx:alpine 
COPY --from=node /app/dist/RentalsAppAngular /usr/share/nginx/html