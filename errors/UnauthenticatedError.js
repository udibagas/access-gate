class UnauthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthenticatedError";
    this.status = 401;
  }
}

module.exports = UnauthenticatedError;
