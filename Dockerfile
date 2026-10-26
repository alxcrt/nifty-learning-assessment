FROM oven/bun:1.4.4-slim AS bun
FROM node:24-bookworm-slim AS build
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY . .
RUN bun install --frozen-lockfile
ARG VITE_SERVER_URL=http://localhost:3000
ENV VITE_SERVER_URL=$VITE_SERVER_URL
RUN bun run test && bun run build && bun run check-types
ENV NODE_ENV=production
EXPOSE 3000 3001
USER node
CMD ["node", "scripts/start.mjs"]
