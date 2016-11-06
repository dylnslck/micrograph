import ensureContextHasModel from './ensureContextHasModel';

export default (args, ctx, resolver) => {
  ensureContextHasModel(ctx);
  const { handle, finalize } = resolver;
  return new Promise(done => handle(args, ctx, done)).then(finalize);
};
