export class InitializationError extends Error {
  constructor(message: string, private error?: Error) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = new.target.name
  }
}
