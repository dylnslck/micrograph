import test from 'ava';
import { createResolver, createMiddleware } from '../src';

const argsAreValid = (t, args, ctx, next) => {
  t.is(typeof args, 'object');
  t.is(typeof ctx, 'object');
  t.is(typeof next, 'function');
};

test('should run asnyc/sync middleware in order with valid patterns', async t => {
  const userResolver = createResolver('createUser', {
    resolve(args, ctx, next) {
      argsAreValid(t, args, ctx, next);

      setTimeout(() => {
        ctx.alphabetical += 'e';
        next();
      }, 50);
    },
  });

  const middleware = createMiddleware();

  middleware.before((args, ctx, next) => {
    argsAreValid(t, args, ctx, next);

    setTimeout(() => {
      ctx.alphabetical += 'a';
      next();
    }, 50);
  });

  middleware.before('*', (args, ctx, next) => {
    argsAreValid(t, args, ctx, next);

    return new Promise(resolve => {
      setTimeout(() => {
        ctx.alphabetical += 'b';
        resolve();
      }, 50);
    });
  });

  middleware.before('invalid*', (args, ctx, next) => {
    argsAreValid(t, args, ctx, next);
    ctx.alphabetical += 'invalid';
    next();
  });

  middleware.before('create*', (args, ctx, next) => {
    argsAreValid(t, args, ctx, next);
    ctx.alphabetical += 'c';
    next();
  });

  middleware.before('createUser', (args, ctx, next) => {
    argsAreValid(t, args, ctx, next);
    ctx.alphabetical += 'd';
    next();
  });

  middleware.after('createUser', (args, ctx, next) => {
    argsAreValid(t, args, ctx, next);
    ctx.alphabetical += 'f';
    next();
  });

  middleware.after('create*', (args, ctx, next) => {
    argsAreValid(t, args, ctx, next);
    ctx.alphabetical += 'g';
    next();
  });

  middleware.after('*', (args, ctx, next) => {
    argsAreValid(t, args, ctx, next);
    ctx.alphabetical += 'h';
    next();
  });

  await new Promise((resolve, reject) => {
    const args = {};
    const ctx = { alphabetical: '' };

    userResolver.handle(middleware.stack, args, ctx, resolve, reject);
  }).then(ctx => {
    t.is(ctx.alphabetical, 'abcdefgh');
  });
});

test('should handle an error', async t => {
  let shouldBeTrue;

  const userResolver = createResolver('createUser', {
    resolve(args, ctx, next) {
      argsAreValid(t, args, ctx, next);
      next();
    },
  });

  const middleware = createMiddleware();

  middleware.before((args, ctx, next) => {
    argsAreValid(t, args, ctx, next);
    shouldBeTrue = true;
    next();
  });

  middleware.before((args, ctx, next) => {
    argsAreValid(t, args, ctx, next);
    throw new Error('Oh no!');
  });

  middleware.before((args, ctx, next) => {
    argsAreValid(t, args, ctx, next);
    shouldBeTrue = false;
  });

  await new Promise((resolve, reject) => {
    const args = {};
    const ctx = {};

    userResolver.handle(middleware.stack, args, ctx, resolve, reject);
  }).then(() => {
    t.fail();
  }).catch(err => {
    t.is(shouldBeTrue, true);
    t.is(err.message, 'Oh no!');
  });
});

test('should handle an async error', async t => {
  let shouldBeTrue;

  const userResolver = createResolver('createUser', {
    resolve(args, ctx, next) {
      argsAreValid(t, args, ctx, next);
      next();
    },
  });

  const middleware = createMiddleware();

  middleware.before((args, ctx, next) => {
    argsAreValid(t, args, ctx, next);
    shouldBeTrue = true;
    next();
  });

  middleware.before((args, ctx, next) => {
    argsAreValid(t, args, ctx, next);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Oh no!'));
      }, 50);
    });
  });

  middleware.before((args, ctx, next) => {
    argsAreValid(t, args, ctx, next);
    shouldBeTrue = false;
  });

  await new Promise((resolve, reject) => {
    const args = {};
    const ctx = {};

    userResolver.handle(middleware.stack, args, ctx, resolve, reject);
  }).then(() => {
    t.fail();
  }).catch(err => {
    t.is(shouldBeTrue, true);
    t.is(err.message, 'Oh no!');
  });
});
