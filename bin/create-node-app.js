#!/usr/bin/env node
const Framework = require('../lib/Framework').default
const CloudRunStarter = require('../lib/cloudrun/CloudRunStarter').default

new Framework({
  starters: [new CloudRunStarter()],
}).runCLI(process.argv)
