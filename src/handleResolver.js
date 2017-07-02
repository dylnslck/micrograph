export default (args, ctx, ast, resolver, middleware) => {
  const { handle, finalize, error } = resolver;
  const stack = middleware && middleware.stack;

  return new Promise((resolve, reject) => handle(stack, args, ctx, ast, resolve, reject))
    .then(({ finalArgs, finalCtx }) => finalize(finalArgs, finalCtx))
    .catch(error);
};
