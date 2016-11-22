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
        resolve(user) {
          const ids = db().get('user', user.id).blogs;

          if (!ids) {
            return {
              totalCount: 0,
              edges: [],
            };
          }

          const blogs = ids
            .map(blog => db().get('blog', blog))
            .map(blog => ({ node: blog }));

          return {
            totalCount: blogs.length,
            edges: blogs,
          };
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
