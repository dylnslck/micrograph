class ErrorLogger {
  errors = []

  add(err) {
    this.errors.push(err);
  }
}

export default function errorLogger() {
  if (errorLogger.logger) return errorLogger.logger;

  return {
    init() {
      errorLogger.logger = new ErrorLogger();
    },
  };
}
