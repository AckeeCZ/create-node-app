#!/usr/bin/env node
require('source-map-support').install()
const Framework = require('../lib/Framework').default
const CloudRunStarter = require('../lib/cloudrun/CloudRunStarter').default
const CloudFunctionsStarter =
  require('../lib/cloudfunctions/CloudFunctionsStarter').default

new Framework({
  starters: [new CloudRunStarter(), new CloudFunctionsStarter()],
}).runCLI(process.argv)
