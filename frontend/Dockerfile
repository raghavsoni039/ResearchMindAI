# ==============================================================================
# ResearchMind AI — Frontend Production Dockerfile (Next.js App Router)
# ==============================================================================

# --- Stage 1: Build Next.js Application ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package manifest (fresh install on Alpine to generate Linux binaries)
COPY package.json ./
RUN npm install

# Copy application source code
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js standalone bundle
RUN npx next build

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
