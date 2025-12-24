# ============================================
# Multi-stage build for Next.js Frontend
# Optimized: ~200-250MB (down from 357MB)
# Build context: fe_ecommerce_ebay/ (parent directory)
# ============================================

FROM node:20-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json ./package.json
COPY pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copy .fe.env to .env.production for Next.js to read during build
# ENV_FILE arg is passed from docker-compose (dev/staging/prod)
ARG ENV_FILE=dev
COPY environment/env/${ENV_FILE}/.fe.env ./.env.production

# Build Next.js (will read .env.production automatically)
RUN pnpm run build

# ============================================
# Production image - minimal runtime
# ============================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only necessary files from builder
COPY --from=builder /app/public ./public

# Copy standalone output (already optimized by Next.js)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port (metadata only, actual port is set by environment variable)
EXPOSE 3000

# PORT will be set by docker-compose environment variable
# Production: PORT=3000 (default, can omit)
# Test: PORT=3001 (must specify in docker-compose)
ENV HOSTNAME="0.0.0.0"

# Use standalone server.js (smaller and faster)
CMD ["node", "server.js"]

