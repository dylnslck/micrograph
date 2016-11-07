import { createMiddleware } from '../../src';

const middleware = createMiddleware();

middleware.before((args, ctx, next) => {
  ctx.startTime = Date.now();
  next();
});

middleware.before('fetch*', (args, ctx, next) => {
  console.log('fetching any type');
  next();
});

middleware.before('fetchUser', (args, ctx, next) => {
  console.log('fetching just a user');
  next();
});

middleware.after((args, ctx, next) => {
  console.log(Date.now() - ctx.startTime);
  next();
});

export default middleware;
