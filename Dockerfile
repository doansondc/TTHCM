FROM nginx:alpine
# Copy the offline project files to Nginx's default public directory
COPY work/ket_qua /usr/share/nginx/html

# Expose port 80 inside the container
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
