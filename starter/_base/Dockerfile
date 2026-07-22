# BUILDER IMAGE
FROM node:26.5.0 AS builder
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

ENV PNPM_VERSION=11.15.1
ENV PNPM_HOME="/pnpm"
ENV PATH="/pnpm/bin:$PATH"
# Install pnpm via the official standalone script (https://pnpm.io/installation).
RUN curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION="${PNPM_VERSION}" ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -
# copy all relevant files
COPY . .
# install dependencies
RUN pnpm install --frozen-lockfile
# compile typescript
RUN pnpm run build

# MAIN IMAGE
FROM node:26.5.0-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="/pnpm/bin:$PATH"
COPY --from=builder /pnpm /pnpm

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
