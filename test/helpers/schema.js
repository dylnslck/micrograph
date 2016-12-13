import { GraphQLString } from 'graphql';
import Schema, { hasMany, belongsTo } from 'cohere';
import { Blog, User } from './models';

export default new Schema()
  .defineType('user', {
    attributes: {
      name: { type: GraphQLString },
      email: { type: GraphQLString },
    },
    relationships: {
      blogs: hasMany('blog', 'author', {
        args: {
          title: { type: GraphQLString },
        },
      }),
    },
    model: User,
  })
  .defineType('blog', {
    attributes: {
      title: { type: GraphQLString },
      content: { type: GraphQLString },
    },
    relationships: {
      author: belongsTo('user', 'blogs'),
    },
    model: Blog,
  })
  .compile();
