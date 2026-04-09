# ── Stage 1: Install dependencies ─────────────────────────────────────────────
FROM oven/bun:1-alpine AS deps
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# ── Stage 2: Build ────────────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Dummy DATABASE_URL so Next.js build doesn't fail — real value injected at runtime
ENV DATABASE_URL=postgresql://placeholder:placeholder@placeholder:5432/placeholder
ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run build

# ── Stage 3: Production runner ────────────────────────────────────────────────
FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Next.js standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static   ./.next/static
COPY --from=builder /app/public         ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["bun", "server.js"]
