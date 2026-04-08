# Build stage
FROM node:20-alpine as build
WORKDIR /app
COPY tthcm-app/package*.json ./
RUN npm install
COPY tthcm-app/ .
RUN npm run build

# Serve stage
FROM nginx:alpine
# Copy the built React app to Nginx's default public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 inside the container
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
