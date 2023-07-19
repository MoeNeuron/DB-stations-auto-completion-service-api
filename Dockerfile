FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
# RUN npm ci --production
RUN npm install

# Copy the rest of the application code
COPY . .

# RUN npm install typescript (you need to include for build script if enable production mode)

# Build the application
RUN npm run build

# Set the production environment
# ENV NODE_ENV=production

# Expose the desired port (replace 3000 with your application's actual port)
EXPOSE 3000

# Start the application
CMD [ "node", "dist/src/server.js" ]
