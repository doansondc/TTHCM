# Build stage
FROM node:20-alpine
WORKDIR /app
COPY tthcm-app/package*.json ./
RUN npm install
COPY tthcm-app/ .
RUN npm run build
# Start Node.js Server
EXPOSE 3001
CMD ["node", "server.js"]
