# ---------- BUILD STAGE ----------
FROM node:20.18.1-bookworm-slim@sha256:b2c8e0eb8a6aeeae33b2711f8f516003e27ee45804e270468d937b3214f2f0cc AS build

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN npm config set strict-ssl false
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

RUN corepack enable && corepack prepare yarn@stable --activate

COPY package.json yarn.lock ./


RUN yarn config set strict-ssl false
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build


# ---------- PROD STAGE ----------
FROM node:20.18.1-bookworm-slim@sha256:b2c8e0eb8a6aeeae33b2711f8f516003e27ee45804e270468d937b3214f2f0cc AS prod

RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN npm config set strict-ssl false
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

ENV NODE_ENV=production

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

COPY package.json yarn.lock ./

RUN yarn config set strict-ssl false
RUN yarn install --frozen-lockfile --production

COPY --from=build /app/dist ./dist

RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD ["dumb-init", "node", "dist/src/main.js"]
