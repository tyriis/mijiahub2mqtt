export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = new.target.name
  }
}
