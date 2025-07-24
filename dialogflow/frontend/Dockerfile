# Step 1: Use official Node.js image as the base image
FROM node:18-alpine AS build

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json (or yarn.lock) into the container
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the .env file into the container
COPY .env ./

# Step 6: Copy the rest of the application code into the container
COPY . .

# Step 7: Build the React app for production
RUN npm run build

# Step 8: Use a simple web server (e.g., serve) to serve the production build
RUN npm install -g serve

# Step 9: Expose port 5000 for the app
EXPOSE 3000

# Step 10: Start the server and serve the build
CMD ["serve", "-s", "build", "-l", "3000"]
