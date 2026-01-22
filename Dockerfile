# ---------- BUILD STAGE ----------
FROM node:20-alpine AS build
WORKDIR /app

RUN npm config set strict-ssl false
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

RUN rm -f /usr/local/bin/yarn /usr/local/bin/yarnpkg
RUN npm install -g yarn

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# ---------- PROD STAGE ----------
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

RUN npm config set strict-ssl false
RUN rm -f /usr/local/bin/yarn /usr/local/bin/yarnpkg
RUN npm install -g yarn

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY --from=build /app/dist ./dist

EXPOSE 3000
USER node
CMD ["node", "dist/src/main.js"]
