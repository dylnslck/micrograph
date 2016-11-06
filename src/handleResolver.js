export default (args, ctx, resolver) => {
  const { handle, finalize } = resolver;
  return new Promise(done => handle(args, ctx, done)).then(finalize);
};
