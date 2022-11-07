# BUILDER IMAGE
FROM node:12.19.0-buster AS builder
ARG NPM_TOKEN
ENV NODE_PATH=.
ENV JOBS="max"
WORKDIR /usr/src/app

ENV DOCKERIZE_VERSION v0.6.1
RUN wget -q "https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz" && \
    tar -C /usr/local/bin -xzvf "dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz" && \
    rm "dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz"

ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini.asc /tini.asc
RUN gpg --batch --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 595E85A6B1B4779EA4DAAEC70B588DFF0527A9B7 \
 && gpg --batch --verify /tini.asc /tini
RUN chmod +x /tini

# important, otherwise postinstall hook fails
RUN npm set unsafe-perm=true
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
FROM node:12.19.0-buster-slim
ENV NODE_PATH=lib
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app /usr/src/app
COPY --from=builder /tini /tini
COPY --from=builder /usr/local/bin/dockerize /usr/local/bin/dockerize
EXPOSE 3000
USER node
ENTRYPOINT ["/tini", "--", "/usr/local/bin/docker-entrypoint.sh"]
CMD [ "node", "-r", "source-map-support/register", "lib/index.js"]
