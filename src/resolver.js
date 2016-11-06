const doesPatternMatch = (pattern, name) => {
  const prefix = pattern.split('*')[0];

  return (
    pattern === '*' ||
    name.startsWith(prefix) ||
    name === pattern
  );
};

const call = (fn, args, ctx, next) => {
  try {
    fn(args, ctx, () => next(args, ctx));
  } catch (err) {
    ctx.errors.push(err);
    next(args, ctx);
  }
};

class Resolver {
  stack = {
    before: [],
    after: [],
  }

  constructor(name, { resolve, finalize = (ctx) => ctx }) {
    if (typeof name !== 'string') {
      throw new TypeError('Argument "name" must be a string.');
    }

    if (typeof resolve !== 'function') {
      throw new TypeError('Argument "resolve" must be a function.');
    }

    this.name = name;
    this.resolve = resolve;
    this.finalize = finalize;
    this.handle = this.handle.bind(this);
  }

  filterStack() {
    const { name } = this;
    const isMatch = ({ pattern }) => doesPatternMatch(pattern, name);

    return {
      before: this.stack.before.filter(isMatch),
      after: this.stack.after.filter(isMatch),
    };
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

  handle(args, ctx, done) {
    const layers = this.layers;
    let index = 0;

    const next = (mutableArgs, mutableCtx) => {
      const layer = layers[index++];

      if (!layer) {
        done(mutableCtx);
        return;
      }

      call(layer.fn, mutableArgs, mutableCtx, next);
    };

    next(args, { ...ctx, errors: [] });
  }

  get layers() {
    if (!this.filteredStackCache) {
      this.filteredStackCache = this.filterStack();
    }

    const { before, after } = this.filteredStackCache;

    return [
      ...before,
      { fn: this.resolve },
      ...after,
    ];
  }
}

export default (...args) => new Resolver(...args);
