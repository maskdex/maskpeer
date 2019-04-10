#!/usr/bin/env node

'use strict'

const signalling = require('libp2p-websocket-star-rendezvous')
const argv = require('minimist')(process.argv.slice(2))

let server

/* eslint-disable no-console */

signalling.start({
  port: argv.port || argv.p || process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080,
  host: argv.host || argv.h || process.env.OPENSHIFT_NODEJS_IP || process.env.HOST || '0.0.0.0',
  cryptoChallenge: !(argv.disableCryptoChallenge || process.env.DISABLE_CRYPTO_CHALLENGE),
  strictMultiaddr: !(argv.disableStrictMultiaddr || process.env.DISABLE_STRICT_MULTIADDR),
  metrics: !(argv.disableMetrics || process.env.DISABLE_METRICS)
}, (err, _server) => {
  if (err) { throw err }
  server = _server

  console.log('Listening on:', server.info.uri)
})

process.on('SIGINT', () => {
  server.stop((err) => {
    console.log('Rendezvous server stopped')
    process.exit(err ? 2 : 0)
  })
})
