# BUILDER IMAGE
FROM node:18.16.0 AS builder
ARG NPM_TOKEN
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

# important, otherwise postinstall hook fails
RUN npm set progress=false
RUN npm set loglevel=error
# copy all relevant files
COPY . .
# RUN echo "//registry.npmjs.org//:_authToken=$NPM_TOKEN" >> .npmrc
# install dependencies
RUN npm ci
# compile typescript
RUN npm run build

# MAIN IMAGE
FROM node:18.16.0-slim

RUN mkdir -p /usr/share/fonts/truetype/
RUN echo ls
COPY --from=builder /usr/src/app/assets/fonts/Consolas.ttf .
RUN install -m644 Consolas.ttf /usr/share/fonts/truetype/
RUN rm ./Consolas.ttf

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
