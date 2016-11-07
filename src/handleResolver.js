const defaultStack = {
  before: [],
  after: [],
};

export default (args, ctx, resolver, middleware) => {
  const { handle, finalize } = resolver;
  const stack = middleware && middleware.stack || defaultStack;
  return new Promise(done => handle(stack, args, ctx, done)).then(finalize);
};
