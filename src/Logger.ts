import { oraPromise } from 'ora'

export class Logger {
  constructor(public readonly enableDebug: boolean = false) {}

  info(message: string) {
    console.log(message)
  }
  verbose(message: string) {
    console.log(message)
  }
  error(message: string) {
    console.log(message)
  }
  debug(message: string) {
    if (this.enableDebug) {
      console.log(message)
    }
  }
  loader(message: string, promise: Promise<any>) {
    if (this.enableDebug) {
      this.info(message)
      return promise
    }

    return oraPromise(promise, {
      text: message,
    })
  }
}
