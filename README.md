# micrograph
⧟ GraphQL middleware framework

## What?
Micrograph is a GraphQL middleware framework that derives queries and mutations from a [cohere](https://github.com/directlyio/cohere) schema. Appropriate documentation is coming soon
and Micrograph should not be considered stable for production.

## Getting started
```
$ npm i -S cohere
$ npm i -S graphql
```

### Create a schema
```js
// schema.js
import Schema, { hasMany, belongsTo } from 'cohere';
import { GraphQLString, GraphQLNonNull } from 'graphql';

const schema = new Schema();

schema.defineType('user', {
  attributes: {
    name: GraphQLString,
    email: new GraphQLNonNull(GraphQLString),
  },
  relationships: {
    blogs: hasMany('blog', 'author', {
      resolve(user, args, ctx) {
        return user.getBlogs();
      },
    }),
  },
  meta: {
    inflection: 'users',
    description: 'A user is a person who can write blogs, among other things.',
  },
});

schema.defineType('blog', {
  attributes: {
    title: GraphQLString,
  },
  relationships: {
    author: belongsTo('user', 'blogs', {
      resolve(blog, args, ctx) {
        return blog.getAuthor();
      },
    }),
  },
  meta: {
    inflection: 'blogs',
    description: 'A blog is some online content, usually written by a user.',
  },
});

export default schema.compile();
```

### Create some resolvers
Resolvers supply the root queries and root mutations with their resolve methods. Resolvers also
support middleware.

```js
// resolvers.js
import { compile, resolver } from 'micrograph';
import schema from './schema';

export const fetchUserResolver = resolver('fetchUser', {
  resolve(args, ctx, next) {
    return ctx.db.fetchUser(args.id).then(next);
  },
});

export const findUsersResolver = resolver('findUsers', {
  resolve(args, ctx, next) {
    return ctx.db.findUsers(args.options).then(next);
  },
});

export const createUserResolver = resolver('createUser', {
  resolve(args, ctx, next) {
    return ctx.db.createUser(args.input).then(next);
  },
});

export const updateUserResolver = resolver('updateUser', {
  resolve(args, ctx, next) {
    return ctx.db.updateUser(args.id, args.input).then(next);
  },
});

export const archiveUserResolver = resolver('archiveUser', {
  resolve(args, ctx, next) {
    return ctx.db.archiveUser(args.id).then(next);
  },
});

// the above resolvers would also be defined for 'fetchBlog', 'findBlogs', 'createBlog',
// 'updateBlog' and 'archiveBlog'

export default compile(schema, resolvers); // fully functional GraphQL schema
```

The compiled schema from the previous example is roughly equivalent to the following GraphQL schema (omitting blog types for brevity).

```
type Query {
  fetchUser(id: ID!): User
  findUsers(options: Options): UserConnection
}

type Mutation {
  createUser(input: UserInput!): User
  updateUser(id: ID!, input: UserInput!): User
  archiveUser(id: ID!): User
}

type User {
  name: String
  email: String!
  blogs: BlogConnection
}

type UserInput {
  name: String
  email: String
}

schema {
  query: Query
  mutation: Mutation
}
```

### Middleware
Each resolver is allowed some `before` and `after` middleware.

```js
// middleware.js
import createUserResolver from './resolvers';

createUserResolver.before((args, ctx, next) => {
  if (!ctx.request.headers.authorization) {
    throw new HttpError(401);
  }

  next();
});
```

## License
[MIT](https://github.com/directlyio/redink-graphql/LICENSE)
