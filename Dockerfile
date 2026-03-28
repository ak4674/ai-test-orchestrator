# Use Node.js 18 (stable for Vite/Express)
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the frontend
RUN npm run build

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Start the server
CMD [ "npm", "start" ]
