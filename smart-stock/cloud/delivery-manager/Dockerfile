# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port on which the app will listen
EXPOSE 80

# Set the environment variables
ENV PORT=80
ENV MONGO_URI=mongodb+srv://s222177103:OPkr3ZdpGQRu0JFf@sit314.okntx.mongodb.net/sit314?retryWrites=true&w=majority
ENV SCHEDULE_MANAGER_URI=http://host.docker.internal:3003

# Start the Node.js application
CMD ["node", "delivery-manager.js"]
