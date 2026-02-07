FROM node:alpine as builder

# 1. Install necessary system libs for Alpine
RUN apk add --no-cache libc6-compat
# 2. Install pnpm directly (bypassing corepack issues)
RUN npm install -g pnpm
# 3. Setup environment
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

# 4. Install dependencies using BuildKit cache
# We copy only the lockfile first to leverage Docker's cache
COPY pnpm-lock.yaml package.json ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# 4. Copy source and build
COPY . .
RUN pnpm run build
CMD ["pnpm", "run", "dev"]

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html