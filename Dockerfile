# 1️⃣ Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# 2️⃣ Production stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# build output එකෙන් standalone server එක copy කරන්න
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Next.js default port
EXPOSE 3002

# server.js start කරන්න
CMD ["npm", "start"]
