#!/usr/bin/env node
import { Bootstrap } from '../lib/Bootstrap.js'
import * as sourceMapSupport from 'source-map-support'

sourceMapSupport.install()
new Bootstrap().runCLI(process.argv)
