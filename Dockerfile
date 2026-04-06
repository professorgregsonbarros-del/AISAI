FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

# Root dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Client build
COPY client/package.json client/package-lock.json* ./client/
RUN cd client && npm install
COPY client/ ./client/
RUN cd client && npm run build

# Server build
COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm install
COPY server/ ./server/
RUN cd server && npx prisma generate
RUN cd server && npx tsc

EXPOSE 3001

CMD cd server && npx prisma db push --accept-data-loss && cd .. && npm start
