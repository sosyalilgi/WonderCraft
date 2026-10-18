# Multi-stage Dockerfile for Dokploy / Docker deployment
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package configuration
COPY package.json package-lock.json* .npmrc* ./

# Install dependencies needed for build
RUN npm install --legacy-peer-deps

# Copy application source code
COPY . .

# Build the frontend assets into dist/
RUN npm run build

# Stage 2: Production runtime image
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package definition
COPY package.json package-lock.json* .npmrc* ./

# Install production dependencies
RUN npm install --omit=dev --legacy-peer-deps

# Copy compiled frontend from builder stage
COPY --from=builder /app/dist ./dist

# Copy backend server code and TypeScript configs
COPY server.ts ./
COPY serverThematicSvg.ts ./
COPY tsconfig.json ./
COPY public ./public

# Expose port 3000 (Dokploy / Traefik default)
EXPOSE 3000

# Health check using Node's built-in fetch (works reliably across all Alpine versions)
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Start the full-stack server
CMD ["npm", "start"]
