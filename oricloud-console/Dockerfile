#Dockerfile for React frontend (orienteerfeed-console)

# Use the official Node.js image to build the frontend
FROM node:20.17-slim as build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build the app for production
RUN npm run build

# Use nginx to serve the built React app
FROM nginx:alpine

# Copy the built app to the Nginx server's default public folder
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Copy custom Nginx config file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port for the frontend app
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
