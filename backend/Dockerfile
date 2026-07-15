# Use official Node.js LTS version
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose the port your backend listens on (e.g., 5000)
EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]