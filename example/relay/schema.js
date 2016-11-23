import { GraphQLString } from 'graphql';
import { connectionDefinitions, connectionArgs } from 'graphql-relay';
import Schema, { hasMany, belongsTo } from 'cohere';
import flattenConnection from './flattenConnection';
import flattenNode from './flattenNode';

export default new Schema()
  .defineType('user', {
    attributes: {
      name: GraphQLString,
      email: GraphQLString,
    },
    relationships: {
      blogs: hasMany('blog', 'author', {
        args: connectionArgs,
        output: (type) => connectionDefinitions({ nodeType: type }).connectionType,
        resolve: (user, args, ctx) => ctx.model('user')
          .findRelated(user.id, 'blogs', args.options)
          .then(flattenConnection),
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
        resolve: (blog, args, ctx) => ctx.model('blog')
          .findRelated(blog.id, 'author')
          .then(flattenNode),
      }),
    },
    meta: {
      inflection: 'blogs',
    },
  })
  .compile();
