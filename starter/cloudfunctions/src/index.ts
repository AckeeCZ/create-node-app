import * as functions from 'firebase-functions'
import graphql from './graphql'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((_request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true })
  response.send('Hello from Firebase!')
})

export const graphqlApi = functions.https.onRequest(graphql as any)
