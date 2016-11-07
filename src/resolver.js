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

  filterStack(stack) {
    const { name } = this;
    const isMatch = ({ pattern }) => doesPatternMatch(pattern, name);

    return {
      before: stack.before.filter(isMatch),
      after: stack.after.filter(isMatch),
    };
  }

  handle(stack, args, ctx, done) {
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

      call(layer.fn, mutableArgs, mutableCtx, next);
    };

    next(args, { ...ctx, errors: [] });
  }
}

export default (...args) => new Resolver(...args);
