# syntax=docker/dockerfile:1
FROM node:22-bullseye-slim AS builder
WORKDIR /app

# Install dependencies first for better layer caching.
COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile

# Copy source and build Nuxt for production.
COPY . .
RUN npx prisma generate
RUN yarn build

FROM node:22-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

# Only copy the Nuxt Nitro output needed to run the app.
COPY --from=builder /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
