import { GraphQLString } from 'graphql';
import Schema, { hasMany, belongsTo } from 'cohere';
import flattenConnection from './flattenConnection';
import flattenNode from './flattenNode';
import optionsInputType from './optionsInputType';

export default new Schema()
  .defineType('user', {
    attributes: {
      name: GraphQLString,
      email: GraphQLString,
    },
    relationships: {
      blogs: hasMany('blog', 'author', {
        args: {
          options: { type: optionsInputType },
        },

        resolve(user, args, ctx) {
          return ctx.model('user')
            .findRelated(user.id, 'blogs', args.options)
            .then(flattenConnection);
        },
      }),
    },
    meta: {
      inflection: 'users',
    },
  })
  .defineType('blog', {
    attributes: {
      title: GraphQLString,
      content: GraphQLString,
    },
    relationships: {
      author: belongsTo('user', 'blogs', {
        resolve(blog, args, ctx) {
          return ctx.model('blog')
            .findRelated(blog.id, 'author')
            .then(flattenNode);
        },
      }),
    },
    meta: {
      inflection: 'blogs',
    },
  })
  .compile();
