#!/bin/bash

if [ "$RUN_DOCKER_COMPOSE_DEPS" == true ]; then
  dockerize -wait tcp://postgres:5432 -timeout 5m "$@"
else
  exec $@
fi
