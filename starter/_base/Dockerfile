# BUILDER IMAGE
FROM node:24.5.0 AS builder
ENV NODE_PATH=.
ENV JOBS="max"
WORKDIR /usr/src/app

ENV DOCKERIZE_VERSION v0.6.1
RUN wget -q "https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz" && \
  tar -C /usr/local/bin -xzvf "dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz" && \
  rm "dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz"

ENV TINI_VERSION v0.19.0
RUN wget -q https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini -O /tini && \
  chmod +x /tini

ENV PNPM_VERSION=10.33.0
RUN curl -fsSL "https://github.com/pnpm/pnpm/releases/download/v${PNPM_VERSION}/pnpm-linux-x64" \
    -o /usr/local/bin/pnpm && chmod +x /usr/local/bin/pnpm
# copy all relevant files
COPY . .
# install dependencies
RUN pnpm install --frozen-lockfile
# compile typescript
RUN pnpm run build

# MAIN IMAGE
FROM node:24.5.0-slim
COPY --from=builder /usr/local/bin/pnpm /usr/local/bin/pnpm

ENV NODE_PATH=dist
ENV CFG_JSON_PATH="/config/secrets.json"
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app /usr/src/app
COPY --from=builder /tini /tini
COPY --from=builder /usr/local/bin/dockerize /usr/local/bin/dockerize
EXPOSE 3000
USER node
ENTRYPOINT ["/tini", "--", "/usr/local/bin/docker-entrypoint.sh"]
CMD [ "node", "-r", "source-map-support/register", "dist/index.js"]
