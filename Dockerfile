FROM node:22-alpine

# Step 1: Set working directory
WORKDIR /app

# Step 2: Copy package files
COPY package*.json ./

RUN npm config set registry https://registry.npmjs.org/

# Step 3: Install dependencies
RUN npm config set loglevel verbose
RUN npm install

# Step 4: Copy all source files
COPY . .

# Step 5: Start the application

CMD ["npm", "start"]