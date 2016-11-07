import flattenConnection from '../flattenConnection';
import flattenNode from '../flattenNode';
import { createResolver } from '../../src';

export const findBlogsResolver = createResolver('findBlogs', {
  resolve(args, ctx, next) {
    ctx.model('blog').find(args.options).then(data => {
      ctx.data = data;
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

export const fetchBlogResolver = createResolver('fetchBlog', {
  resolve(args, ctx, next) {
    ctx.model('blog').fetch(args.id).then(data => {
      ctx.data = data;
      next();
    });
  },

  finalize(ctx) {
    return flattenNode(ctx.data);
  },
});

export const createBlogResolver = createResolver('createBlog', {
  resolve(args, ctx, next) {
    ctx.model('blog').create(args.input).then(data => {
      ctx.data = data;
      next();
    });
  },

  finalize(ctx) {
    return flattenNode(ctx.data);
  },
});

export const updateBlogResolver = createResolver('updateBlog', {
  resolve(args, ctx, next) {
    ctx.model('blog').update(args.id, args.input).then(data => {
      ctx.data = data;
      next();
    });
  },

  finalize(ctx) {
    return flattenNode(ctx.data);
  },
});

export const archiveBlogResolver = createResolver('archiveBlog', {
  resolve(args, ctx, next) {
    ctx.model('blog').archive(args.id).then(data => {
      ctx.data = data;
      next();
    });
  },

  finalize(ctx) {
    return flattenNode(ctx.data);
  },
});
