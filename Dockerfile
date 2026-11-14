# syntax=docker/dockerfile:1

# The pnpm version is pinned so the image is reproducible and does not
# download a package manager at run time.
ARG PNPM_VERSION=11.22.0

# ---------------------------------------------------------------------
# Dependencies
# ---------------------------------------------------------------------
FROM node:22-alpine AS deps
ARG PNPM_VERSION
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
# --ignore-scripts because the postinstall hook runs `prisma generate`,
# which is done explicitly in the build stage.
RUN pnpm install --frozen-lockfile --ignore-scripts

# ---------------------------------------------------------------------
# Build
# ---------------------------------------------------------------------
FROM node:22-alpine AS build
ARG PNPM_VERSION
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm prisma generate
RUN pnpm run build

# ---------------------------------------------------------------------
# Production dependencies
#
# `prisma` is a production dependency because the migrations are applied
# when the container starts.
# ---------------------------------------------------------------------
FROM node:22-alpine AS prod-deps
ARG PNPM_VERSION
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts --prod

# ---------------------------------------------------------------------
# Runner
# ---------------------------------------------------------------------
FROM node:22-alpine AS runner
ARG PNPM_VERSION
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate
ENV NODE_ENV=production
WORKDIR /app

# Only the production dependencies are shipped.
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma7.config.ts ./prisma7.config.ts
COPY --from=build /app/package.json ./package.json
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh

# Run as a non-root user.
RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app

EXPOSE 3000

# The migrations are applied on start-up; the health check reports the
# readiness of the HTTP server.
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||3000)+'/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

ENTRYPOINT ["./docker-entrypoint.sh"]
