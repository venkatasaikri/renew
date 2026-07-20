FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Run build for ts (we'll define a build script in package.json)
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
