# ==============================================================================
# ResearchMind AI — Frontend Production Dockerfile (Next.js App Router)
# ==============================================================================

# --- Stage 1: Build Next.js Application ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency manifests and install all packages (including next CLI)
COPY package.json package-lock.json ./
RUN npm install

# Copy application source code
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Compile Next.js production build
RUN npm run build

# --- Stage 2: Production Lightweight Runner ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Create non-root system user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built artifacts from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
