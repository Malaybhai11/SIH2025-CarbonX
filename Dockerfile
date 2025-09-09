FROM node:20-slim

# Set working directory
WORKDIR /app

# Install OpenSSL (needed for Prisma)
# RUN apt-get update && apt-get install -y openssl libssl-dev

# Copy project files
COPY . .

# Install dependencies
RUN npm install

# Generate Prisma client (add correct target)
# RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3002

# Start the app
CMD ["npm", "run", "start"]