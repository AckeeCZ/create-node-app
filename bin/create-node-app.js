#!/usr/bin/env node
require('source-map-support').install()
const Bootstrap = require('../lib/Bootstrap').default

new Bootstrap().runCLI(process.argv)
