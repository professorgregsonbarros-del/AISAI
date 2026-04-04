FROM node:20-alpine

WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl

# Install root dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Build client
COPY client/package.json client/package-lock.json* ./client/
RUN cd client && npm install

COPY client/ ./client/
RUN cd client && npm run build

# Build server
COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm install

COPY server/ ./server/
RUN cd server && npx prisma generate && npx tsc

EXPOSE 3001

CMD ["npm", "start"]
