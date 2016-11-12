const defaultStack = {
  before: [],
  after: [],
};

export default (args, ctx, resolver, middleware) => {
  const { handle, finalize, error } = resolver;
  const stack = middleware && middleware.stack || defaultStack;

  return new Promise((resolve, reject) => handle(stack, args, ctx, resolve, reject))
    .then(finalize)
    .catch(error);
};
