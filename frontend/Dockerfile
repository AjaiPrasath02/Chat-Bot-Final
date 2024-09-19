# Step 1: Use an official Node.js image as the base
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json/yarn.lock to the working directory
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the app's source code to the working directory
COPY . .

# Step 6: Build the React app for production
RUN npm run build

# Step 7: Install serve to serve the build folder
RUN npm install -g serve

# Step 8: Expose the port your app will run on
EXPOSE 3000

# Step 9: Start the app by serving the build directory
CMD ["serve", "-s", "build", "-l", "3000"]
