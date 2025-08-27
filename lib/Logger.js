import { oraPromise } from 'ora'
export class Logger {
  constructor(enableDebug = false) {
    this.enableDebug = enableDebug
  }
  info(message) {
    console.log(message)
  }
  verbose(message) {
    console.log(message)
  }
  error(message) {
    console.log(message)
  }
  debug(message) {
    if (this.enableDebug) {
      console.log(message)
    }
  }
  loader(message, promise) {
    if (this.enableDebug) {
      this.info(message)
      return promise
    }
    return oraPromise(promise, {
      text: message,
    })
  }
}
//# sourceMappingURL=Logger.js.map
