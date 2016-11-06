import flattenConnection from '../flattenConnection';
import flattenNode from '../flattenNode';
import { resolver } from '../../src';

export const findBlogsResolver = resolver('findBlogs', {
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

export const fetchBlogResolver = resolver('fetchBlog', {
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

export const createBlogResolver = resolver('createBlog', {
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

export const updateBlogResolver = resolver('updateBlog', {
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

export const archiveBlogResolver = resolver('archiveBlog', {
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
