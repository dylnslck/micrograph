# Data modeling

## Cohere
Micrograph uses Cohere for modeling data.

Cohere is a simple schema lib that is concerned with **attributes** and **relationships**. Cohere supports "bring-your-own-typing" for attributes (such as GraphQL scalar types). Micrograph requires that you use GraphQL scalar types for attributes, but if you choose to use Cohere for a different project, you can use arbitrary typing (or none at all).

```
npm install --save cohere
```

### Relationships
Cohere is opiniated with relationships. It supports **hasMany**, **belongsTo**, and **hasOne**.

### hasMany(type: String, inverse: String, options: Object)
The `hasMany` relationship is used for **1:N** or **M:N** relationships. For example, a user might have many blogs. In another example, a teacher might have many students and vice versa.

```javascript
import { GraphQLString } from 'graphql';
import Schema, { hasMany, belongsTo, hasOne } from 'cohere';

export default new Schema()
  .defineType('user', {
    attributes: {
      name: GraphQLString,
    },
    relationships: {
      blogs: hasMany('blog', 'author', {...}),
    },
  })
  .defineType('blog', {
    attributes: {
      title: GraphQLString,
    },
    relationships: {
      author: belongsTo('user', 'blogs', {...}),
    },
  })
  .compile();
```
Micrograph will generate a `BlogConnection` type. For more information on Connections, refer to the [Relay Connection docs](https://facebook.github.io/relay/docs/graphql-connections.html#content). For example, a GraphQL query might then look like:
```
query getUsersBlogs {
  fetchUser(id: "1") {
    name
    blogs {
      totalCount,
      pageInfo {
        hasNextPage
        startCursor
      }
      edges {
        node {
          title
        }
      }
    }
  }
}

query getBlogsAuthor {
  fetchBlog(id: "1") {
    title
    author {
      name
    }
  }
}
```

### belongsTo vs. hasOne
Both `belongsTo` and `hasOne` are for modeling **1:1** relationships. In the example above, the `blog` type belongs to a `user` type via the `author` field.

Micrograph will generate an `author` field on the `Blog` type that points to a `User` type.

What's the difference between `belongsTo` and `hasOne`?

Nothing, really. They both represent **1:1** relationships, and Cohere includes both mainly for use the database layer. For example, we typically use `belongsTo` on a piece of data that we consider to be **dependent**. In other words, the existence of a `blog` depends on the existence of a `user`. A blog cannot exist without an author. In contrast, a `user` might have a `company` relationship:
```
...
relationships: {
  blogs: ...,
  company: hasOne('company', 'employees', {...}),
},
...
```
In this example, it doesn't make sense for a `user` to belong to a company because a user might be unemployed. We're stating that a `user` may only ever have **0** or **1** company at a time.

Micrograph handles `belongsTo` and `hasOne` relationships identically, and their use cases are left to the developer. For example, you might use `belongsTo` or `hasOne` to specify which table has the foreign key, or which NoSQL collection has an index.

### Resolving relationships
Micrograph requires that every relationship's third argument is an object. This object must have a `resolve` function and an optional `args` object.

### .resolve(parent, args, ctx)
The `resolve` function does the majority of the work. Almost always, it will retrieve data from a database.
```
...
relationships: {
  blogs: hasMany('blog', 'author', {
    resolve: (parent, args, ctx) => {
      // Pretend the server configured the ctx
      // object with a convenient database service
      return ctx.db.user(parent.id).blogs();
    },
  },
},
...
```
Once we get the data from the database, we mutate `ctx` so that it can be consumed by `finalize`.
### .args
You can specify arguments to be used by `resolve` just like normal:
```
...
relationships: {
  blogs: hasMany('blog', 'author', {
    args: {
      limit: { type: GraphQLInt },
    },
    resolve: (parent, args, ctx) => {
      // Pretend our database service has a "limit" option
      // to limit the number of blogs returned
      return ctx.db.user(parent.id).blogs({ limit });
    },
  },
},
...
```
When resolving fields, you must make sure the retrieved data has the proper shape.

For example, if our database service returns data in a top-level `data` key, our example above needs to be modified:
```
...
relationships: {
  blogs: hasMany('blog', 'author', {
    args: {
      limit: { type: GraphQLInt },
    },
    resolve: (parent, args, ctx) => {
      // Extract the data out
      return ctx.db.user(parent.id).blogs({ limit })
        .then(res => res.data);
    },
  },
},
...
```