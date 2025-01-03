# Use Node.js 16+ Alpine image
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the service
CMD [ "npm", "start" ]
