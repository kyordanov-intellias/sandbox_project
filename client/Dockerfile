FROM node:18-alpine

WORKDIR /app

# Copy both package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Then copy the rest of the files
COPY . .

# Expose port
EXPOSE 5173

# Start dev server with host flag
CMD ["npm", "run", "dev", "--", "--host"]