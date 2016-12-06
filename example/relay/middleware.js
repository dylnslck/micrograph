import { createMiddleware } from '../../src';

const middleware = createMiddleware();

middleware.before((args, ctx, next) => {
  ctx.startTime = Date.now();
  next();
});

middleware.after((args, ctx, next) => {
  console.log(Date.now() - ctx.startTime);
  next();
});

export default middleware;
