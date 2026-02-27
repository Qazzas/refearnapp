# --- STAGE 1: Prune Monorepo ---
# We use a base image to install pnpm and prepare the workspace
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# --- STAGE 2: Install dependencies ---
FROM base AS deps
# Copy only the manifests needed to install dependencies (for better caching)
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/dashboard/package.json ./apps/dashboard/
COPY packages/paddle-config/package.json ./packages/paddle-config/

# Install dependencies
RUN pnpm install --frozen-lockfile

# --- STAGE 3: Build Dashboard ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --- IMPORTANT: Build-time Variables ---
# These must match the keys in your Coolify Environment Variables
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_SELF_HOSTED
ARG NEXT_PUBLIC_PAYPAL_CLIENT_ID
ARG NEXT_PUBLIC_CNAME_TARGET

# Map ARGs to ENVs so the Next.js build process can see them
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_SELF_HOSTED=$NEXT_PUBLIC_SELF_HOSTED
ENV NEXT_PUBLIC_PAYPAL_CLIENT_ID=$NEXT_PUBLIC_PAYPAL_CLIENT_ID
ENV NEXT_PUBLIC_CNAME_TARGET=$NEXT_PUBLIC_CNAME_TARGET

RUN pnpm run build --filter="@repo/dashboard"

# --- STAGE 4: Final Production Image ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Copy standalone build (Next.js Standalone mode is required in next.config.js)
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/.next/static ./apps/dashboard/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/dashboard/public ./apps/dashboard/public

USER nextjs
EXPOSE 3000

# Next.js standalone entry point
CMD ["node", "apps/dashboard/server.js"]
