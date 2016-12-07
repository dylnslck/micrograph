import { createMiddleware } from '../src';

const middleware = createMiddleware();

middleware.before((args, ctx, next) => {
  ctx.startTime = Date.now();
  next();
});

middleware.before('create*', (args, ctx, next) => {
  console.log('About to create something!');
  next();
});

middleware.before('createUser', (args, ctx, next) => {
  console.log('About to create a user!');
  next();
});

middleware.after((args, ctx, next) => {
  console.log('Duration:', Date.now() - ctx.startTime);
  next();
});

export default middleware;
