import test from 'ava';
import { createMiddleware } from '../src';
import createResolver from '../src/resolver';

const argsAreValid = (t, args, ctx, ast, next) => {
  t.is(typeof args, 'object');
  t.is(typeof ctx, 'object');
  t.is(typeof ast, 'object');
  t.is(typeof next, 'function');
};

test('should fail to create a resolver with invalid args', t => {
  try {
    createResolver();
  } catch (err) {
    t.is(err.message, 'Argument "name" must be a string.');
  }

  try {
    createResolver('createUser');
  } catch (err) {
    t.is(err.message, 'Argument "resolve" must be a function.');
  }

  try {
    createResolver('createUser', {});
  } catch (err) {
    t.is(err.message, 'Argument "resolve" must be a function.');
  }
});

test('should run asnyc/sync middleware in order with valid patterns', async t => {
  const userResolver = createResolver('createUser', {
    resolve(args, ctx, ast, next) {
      argsAreValid(t, args, ctx, ast, next);

      setTimeout(() => {
        ctx.alphabetical += 'e';
        next();
      }, 50);
    },
  });

  const middleware = createMiddleware();

  middleware.before((args, ctx, ast, next) => {
    argsAreValid(t, args, ctx, ast, next);

    setTimeout(() => {
      ctx.alphabetical += 'a';
      next();
    }, 50);
  });

  middleware.before('*', (args, ctx, ast, next) => {
    argsAreValid(t, args, ctx, ast, next);

    return new Promise(resolve => {
      setTimeout(() => {
        ctx.alphabetical += 'b';
        resolve();
      }, 50);
    });
  });

  middleware.before('invalid*', (args, ctx, ast, next) => {
    argsAreValid(t, args, ctx, ast, next);
    ctx.alphabetical += 'invalid';
    next();
  });

  middleware.before('create*', (args, ctx, ast, next) => {
    argsAreValid(t, args, ctx, ast, next);
    ctx.alphabetical += 'c';
    next();
  });

  middleware.before('createUser', (args, ctx, ast, next) => {
    argsAreValid(t, args, ctx, ast, next);
    ctx.alphabetical += 'd';
    next();
  });

  middleware.after('createUser', (args, ctx, ast, next) => {
    argsAreValid(t, args, ctx, ast, next);
    ctx.alphabetical += 'f';
    next();
  });

  middleware.after('create*', (args, ctx, ast, next) => {
    argsAreValid(t, args, ctx, ast, next);
    ctx.alphabetical += 'g';
    next();
  });

  middleware.after('*', (args, ctx, ast, next) => {
    argsAreValid(t, args, ctx, ast, next);
    ctx.alphabetical += 'h';
    next();
  });

  await new Promise((resolve, reject) => {
    const args = {};
    const ctx = { alphabetical: '' };
    const ast = {};

    userResolver.handle(middleware.stack, args, ctx, ast, resolve, reject);
  }).then(({ finalCtx }) => {
    t.is(finalCtx.alphabetical, 'abcdefgh');
  });
});

test('should handle an error', async t => {
  let shouldBeTrue;

  const userResolver = createResolver('createUser', {
    resolve(args, ctx, ast, next) {
      argsAreValid(t, args, ctx, ast, next);
      next();
    },
  });

  const middleware = createMiddleware();

  middleware.before((args, ctx, ast, next) => {
    argsAreValid(t, args, ctx, ast, next);
    shouldBeTrue = true;
    next();
  });

  middleware.before((args, ctx, ast, next) => {
    argsAreValid(t, args, ctx, ast, next);
    throw new Error('Oh no!');
  });

  middleware.before((args, ctx, ast, next) => {
    argsAreValid(t, args, ctx, ast, next);
    shouldBeTrue = false;
  });

  await new Promise((resolve, reject) => {
    const args = {};
    const ctx = {};
    const ast = {};

    userResolver.handle(middleware.stack, args, ctx, ast, resolve, reject);
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
    resolve(args, ctx, ast, next) {
      argsAreValid(t, args, ctx, ast, next);
      next();
    },
  });

  const middleware = createMiddleware();

  middleware.before((args, ctx, ast, next) => {
    argsAreValid(t, args, ctx, ast, next);
    shouldBeTrue = true;
    next();
  });

  middleware.before((args, ctx, ast, next) => {
    argsAreValid(t, args, ctx, ast, next);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Oh no!'));
      }, 50);
    });
  });

  middleware.before((args, ctx, ast, next) => {
    argsAreValid(t, args, ctx, ast, next);
    shouldBeTrue = false;
  });

  await new Promise((resolve, reject) => {
    const args = {};
    const ctx = {};
    const ast = {};

    userResolver.handle(middleware.stack, args, ctx, ast, resolve, reject);
  }).then(() => {
    t.fail();
  }).catch(err => {
    t.is(shouldBeTrue, true);
    t.is(err.message, 'Oh no!');
  });
});
