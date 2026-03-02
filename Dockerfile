# --- STAGE 1: Install dependencies ---
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace configs and manifests
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/dashboard/package.json ./apps/dashboard/
COPY packages/paddle-config/package.json ./packages/paddle-config/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# --- STAGE 2: Build ---
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Bring in the node_modules
COPY --from=deps /app /app

# COPY EVERYTHING needed for the build and migrations
COPY apps/dashboard ./apps/dashboard
COPY packages/paddle-config ./packages/paddle-config
COPY turbo.json ./turbo.json

# Public Build-time variables (Non-sensitive)
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_PAYPAL_CLIENT_ID
ARG NEXT_PUBLIC_SELF_HOSTED
ARG NEXT_PUBLIC_CNAME_TARGET

ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_PAYPAL_CLIENT_ID=$NEXT_PUBLIC_PAYPAL_CLIENT_ID
ENV NEXT_PUBLIC_SELF_HOSTED=$NEXT_PUBLIC_SELF_HOSTED
ENV NEXT_PUBLIC_CNAME_TARGET=$NEXT_PUBLIC_CNAME_TARGET

# Build the dashboard
RUN pnpm turbo run build --filter="@repo/dashboard"

# --- STAGE 3: Final Run ---
FROM node:20-alpine AS dashboard
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Install 'tsx' for migrations/seeding
RUN npm install -g tsx

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# 1. Copy Standalone Files
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/.next/static ./apps/dashboard/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/public ./apps/dashboard/public

# 2. Copy Database & Config (Fixed pathing)
# We use conditional copy to avoid failing if drizzle folder is empty
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/drizzle* ./apps/dashboard/drizzle/
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/src/db ./apps/dashboard/src/db
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/drizzle.config.ts ./apps/dashboard/

# 3. Entrypoint Script
# Note: Sensitive envs like INTERNAL_SECRET are NOT in ARG; they are injected by Coolify at runtime
RUN echo '#!/bin/sh \n\
echo "Running migrations..." \n\
npx drizzle-kit push --force --config apps/dashboard/drizzle.config.ts \n\
echo "Seeding exchange rates..." \n\
npx tsx apps/dashboard/src/db/currencySeed.ts \n\
echo "Starting Next.js..." \n\
node apps/dashboard/server.js' > /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh && chown nextjs:nodejs /app/entrypoint.sh

USER nextjs
EXPOSE 3000

CMD ["/app/entrypoint.sh"]