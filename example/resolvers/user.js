import flattenConnection from '../flattenConnection';
import flattenNode from '../flattenNode';
import { createResolver } from '../../src';

export const findUsersResolver = createResolver('findUsers', {
  resolve(args, ctx, next) {
    ctx.model('user').find(args.options).then(data => {
      ctx.data = data;
      next();
    });
  },

  finalize(ctx) {
    return flattenConnection(ctx.data);
  },
});

export const fetchUserResolver = createResolver('fetchUser', {
  resolve(args, ctx, next) {
    ctx.model('user').fetch(args.id).then(data => {
      ctx.data = data;
      next();
    });
  },

  finalize(ctx) {
    return flattenNode(ctx.data);
  },
});

export const createUserResolver = createResolver('createUser', {
  resolve(args, ctx, next) {
    ctx.model('user').create(args.input).then(data => {
      ctx.data = data;
      next();
    });
  },

  finalize(ctx) {
    return flattenNode(ctx.data);
  },
});

export const updateUserResolver = createResolver('updateUser', {
  resolve(args, ctx, next) {
    ctx.model('user').update(args.id, args.input).then(data => {
      ctx.data = data;
      next();
    });
  },

  finalize(ctx) {
    return flattenNode(ctx.data);
  },
});

export const archiveUserResolver = createResolver('archiveUser', {
  resolve() {
    throw new Error('This should not throw.');
  },

  finalize(ctx) {
    return flattenNode(ctx.data);
  },

  error(err) {
    console.log('err.message:', err.message);
    console.log('err.stack:', err.stack);
    return err;
  },
});
