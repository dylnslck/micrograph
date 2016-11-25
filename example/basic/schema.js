import { GraphQLString, GraphQLList } from 'graphql';
import Schema, { hasMany, belongsTo } from 'cohere';

export default new Schema()
  .defineType('user', {
    attributes: {
      name: GraphQLString,
      email: GraphQLString,
    },
    relationships: {
      blogs: hasMany('blog', 'author', {
        output: GraphQLList,
        resolve(user, args, ctx) {
          return new Promise((resolve, reject) => {
            ctx.db.user.findOne({ _id: user.id }, (err, { blogs = [] }) => {
              if (err) {
                return reject(err);
              }

              return resolve(blogs);
            });
          });
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
          return new Promise((resolve, reject) => {
            ctx.db.blog.findOne({ _id: blog.id }, (err, { author }) => {
              if (err) {
                return reject(err);
              }

              return resolve(author);
            });
          });
        },
      }),
    },
    meta: {
      inflection: 'blogs',
    },
  })
  .compile();
