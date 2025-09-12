# Use official Node.js LTS version
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# Expose the port your backend listens on (e.g., 5000)
EXPOSE 5000

# Start the server
CMD ["npm", "run", "start"]