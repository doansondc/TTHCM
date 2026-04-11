#!/bin/bash
echo "Building the React app..."
cd /Users/doanson/Desktop/DS-PRJ/tthcm-app
npm run build

echo "Pumping files to server..."
# Tạo thư mục trên server
ssh -o StrictHostKeyChecking=no -i ~/.ssh/google_compute_engine doanson@34.126.106.92 "mkdir -p ~/tthcm-live"

# Copy source server
scp -o StrictHostKeyChecking=no -i ~/.ssh/google_compute_engine package*.json server.js doanson@34.126.106.92:~/tthcm-live/

# Copy dist 
scp -o StrictHostKeyChecking=no -i ~/.ssh/google_compute_engine -r dist doanson@34.126.106.92:~/tthcm-live/

echo "Starting Realtime Server on Remote Host..."
ssh -o StrictHostKeyChecking=no -i ~/.ssh/google_compute_engine doanson@34.126.106.92 "cd ~/tthcm-live && npm install && npm install pm2 -g --no-fund && pm2 kill && pm2 start server.js"

echo "DONE! The Live Event Server is now running on http://34.126.106.92:3000"
