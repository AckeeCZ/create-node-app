FROM node:20.5.1 as builder
ARG PRIVATE_KEY
ENV NODE_PATH=.
WORKDIR /usr/src/app
COPY . .
# important, otherwise postinstall hook fails
RUN npm set unsafe-perm true
# build command
WORKDIR /usr/src/app
RUN npm ci
#RUN npm run import:compile

FROM ackee/docker-firebase:20.5.1
COPY --from=builder /usr/src/app /usr/src/app
WORKDIR /usr/src/app
