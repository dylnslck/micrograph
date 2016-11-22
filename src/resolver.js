const doesPatternMatch = (pattern, name) => {
  const prefix = pattern.split('*')[0];

  return (
    pattern === '*' ||
    name.startsWith(prefix) ||
    name === pattern
  );
};

const call = (fn, args, ctx, next, escape) => {
  try {
    const called = fn(args, ctx, () => next(args, ctx));

    if (called && typeof called.then === 'function') {
      called.then(() => next(args, ctx)).catch(escape);
    }
  } catch (err) {
    escape(err);
  }
};

class Resolver {
  constructor(name, { resolve, finalize = (ctx) => ctx, error = (err) => err } = {}) {
    if (typeof name !== 'string') {
      throw new TypeError('Argument "name" must be a string.');
    }

    if (typeof resolve !== 'function') {
      throw new TypeError('Argument "resolve" must be a function.');
    }

    this.name = name;
    this.resolve = resolve;
    this.finalize = finalize;
    this.error = error;
    this.handle = this.handle.bind(this);
  }

  filterStack(stack) {
    const { name } = this;
    const isMatch = ({ pattern }) => doesPatternMatch(pattern, name);

    return {
      before: stack.before.filter(isMatch),
      after: stack.after.filter(isMatch),
    };
  }

  handle(stack, args, ctx, done, escape) {
    const { before, after } = this.filterStack(stack);
    const layers = [
      ...before,
      { fn: this.resolve },
      ...after,
    ];

    let index = 0;

    const next = (mutableArgs, mutableCtx) => {
      const layer = layers[index++];

      if (!layer) {
        done(mutableCtx);
        return;
      }

      call(layer.fn, mutableArgs, mutableCtx, next, escape);
    };

    next({ ...args }, { ...ctx });
  }
}

/* istanbul ignore next */
export default (...args) => new Resolver(...args);
