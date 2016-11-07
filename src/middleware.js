class Middleware {
  stack = {
    before: [],
    after: [],
  }

  before(pattern, fn) {
    if (!fn) {
      if (typeof pattern !== 'function') {
        throw new TypeError('Resolver middleware must be called with a function.');
      }

      fn = pattern;
      pattern = '*';
    } else {
      if (typeof fn !== 'function') {
        throw new TypeError('Resolver middleware must be called with a function.');
      }
    }

    this.stack.before.push({ pattern, fn });
  }

  after(pattern, fn) {
    if (!fn) {
      if (typeof pattern !== 'function') {
        throw new TypeError('Resolver middleware must be called with a function.');
      }

      fn = pattern;
      pattern = '*';
    } else {
      if (typeof fn !== 'function') {
        throw new TypeError('Resolver middleware must be called with a function.');
      }
    }

    this.stack.after.push({ pattern, fn });
  }
}

export default (...args) => new Middleware(...args);
