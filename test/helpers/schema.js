import { GraphQLString } from 'graphql';
import Schema, { hasMany, belongsTo } from 'cohere';
import db from './database';

export default new Schema()
  .defineType('user', {
    attributes: {
      name: GraphQLString,
      email: GraphQLString,
    },
    relationships: {
      blogs: hasMany('blog', 'author', {
        args: {
          title: { type: GraphQLString },
        },
        resolve({ blogs }) {
          if (!blogs) return [];
          return blogs.map(id => db().get('blog', id));
        },
      }),
    },
  })
  .defineType('blog', {
    attributes: {
      title: GraphQLString,
      content: GraphQLString,
    },
    relationships: {
      author: belongsTo('user', 'blogs', {
        resolve(blog) {
          return db().get('user', db().get('blog', blog.id).author);
        },
      }),
    },
  })
  .compile();
