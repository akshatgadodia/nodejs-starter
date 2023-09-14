# Use a specific version of the Node.js image
FROM docker.io/node:latest as BASE

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install project dependencies
RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the port that your application is listening on
EXPOSE 5000
