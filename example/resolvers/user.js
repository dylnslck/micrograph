import flattenConnection from '../flattenConnection';
import flattenNode from '../flattenNode';
import { createResolver } from '../../src';

export const findUsersResolver = createResolver('findUsers', {
  resolve(args, ctx, next) {
    ctx.model('user').find(args.options).then(data => {
      ctx.data = data;

      // FIXME: change API to pass data along through next? next(data)??;
      next();
    });
  },

  finalize(ctx) {
    return {
      ...flattenConnection(ctx.data),

      // FIXME: should not have to be user defined
      errors: ctx.errors,
    };
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
  resolve(args, ctx, next) {
    ctx.model('user').archive(args.id).then(data => {
      ctx.data = data;
      next();
    });
  },

  finalize(ctx) {
    return flattenNode(ctx.data);
  },
});
