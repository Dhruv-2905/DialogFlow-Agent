# Step 1: Use Node.js image to install dependencies and build the app
FROM node:18 AS backend

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the backend port (5000 is commonly used)
EXPOSE 5000

# Start the Express server
CMD ["node", "server.js"]
