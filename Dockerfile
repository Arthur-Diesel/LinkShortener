# Build stage
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY tsconfig.json src ./
RUN npm run build

# Production stage
FROM node:16-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

# Runner stage
FROM node:16-alpine AS runner
WORKDIR /app
COPY --from=prod /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
CMD ["npm", "start"]