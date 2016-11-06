import test from 'ava';
import resolver from '../src/resolver';

const argsAreValid = (t, args, ctx, next) => {
  t.is(typeof args, 'object');
  t.is(typeof ctx, 'object');
  t.is(typeof next, 'function');
};

test('should run asnyc/sync middleware in order with valid patterns', async t => {
  const userResolver = resolver('createUser', {
    resolve(args, ctx, next) {
      argsAreValid(t, args, ctx, next);

      setTimeout(() => {
        ctx.alphabetical += 'e';
        next();
      }, 50);
    },
  });

  userResolver.before((args, ctx, next) => {
    argsAreValid(t, args, ctx, next);

    setTimeout(() => {
      ctx.alphabetical += 'a';
      next();
    }, 50);
  });

  userResolver.before('*', (args, ctx, next) => {
    argsAreValid(t, args, ctx, next);

    setTimeout(() => {
      ctx.alphabetical += 'b';
      next();
    }, 50);
  });

  userResolver.before('invalid*', (args, ctx, next) => {
    argsAreValid(t, args, ctx, next);
    ctx.alphabetical += 'invalid';
    next();
  });

  userResolver.before('create*', (args, ctx, next) => {
    argsAreValid(t, args, ctx, next);
    ctx.alphabetical += 'c';
    next();
  });

  userResolver.before('createUser', (args, ctx, next) => {
    argsAreValid(t, args, ctx, next);
    ctx.alphabetical += 'd';
    next();
  });

  userResolver.after('createUser', (args, ctx, next) => {
    argsAreValid(t, args, ctx, next);
    ctx.alphabetical += 'f';
    next();
  });

  userResolver.after('create*', (args, ctx, next) => {
    argsAreValid(t, args, ctx, next);
    ctx.alphabetical += 'g';
    next();
  });

  userResolver.after('*', (args, ctx, next) => {
    argsAreValid(t, args, ctx, next);
    ctx.alphabetical += 'h';
    next();
  });

  await new Promise(resolve => {
    const args = {};
    const ctx = { alphabetical: '' };

    userResolver.handle(args, ctx, resolve);
  }).then(ctx => {
    t.is(ctx.alphabetical, 'abcdefgh');
  });
});

test('should pass errors down the stack', async t => {
  const userResolver = resolver('createUser', {
    resolve(args, ctx, next) {
      argsAreValid(t, args, ctx, next);
      next();
    },
  });

  userResolver.before((args, ctx, next) => {
    argsAreValid(t, args, ctx, next);

    throw new Error('Oh no!');
  });

  userResolver.after((args, ctx, next) => {
    argsAreValid(t, args, ctx, next);

    throw new Error('Oh no again!');
  });

  await new Promise(resolve => {
    const args = {};
    const ctx = {};

    userResolver.handle(args, ctx, resolve);
  }).then(ctx => {
    t.is(ctx.errors.length, 2);
  });
});
