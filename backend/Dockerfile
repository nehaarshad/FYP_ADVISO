FROM node:20-alpine
WORKDIR /FYPbackend
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]