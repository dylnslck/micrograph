# Data modeling

## Cohere
Micrograph uses [cohere](https://github.com/directlyio/cohere) for modeling data.

`cohere` is a simple schema lib that is concerned with **attributes** and **relationships**. `cohere` supports "bring-your-own-typing" for attributes (such as GraphQL scalar types). Micrograph requires that you use GraphQL scalar types for attributes, but if you choose to use `cohere` for a different project, you can use arbitrary typing (or none at all).

```sh
npm install --save cohere
```

### Relationships
`cohere` is opiniated with relationships. It supports **hasMany**, **belongsTo**, and **hasOne**.

### `hasMany(type, inverse, options)`
The `hasMany` relationship is used for **M:1** or **M:N** relationships. For example, a user might have many blogs. In another example, a teacher might have many students and vice versa.

```javascript
import { GraphQLString } from 'graphql';
import Schema, { hasMany, belongsTo, hasOne } from 'cohere';
import { Blog, User } from './models';

export default new Schema()
  .defineType('user', {
    attributes: {
      name: GraphQLString,
    },
    relationships: {
      blogs: hasMany('blog', 'author', {...}),
    },
    model: User,
  })
  .defineType('blog', {
    attributes: {
      title: GraphQLString,
    },
    relationships: {
      author: belongsTo('user', 'blogs', {...}),
    },
    model: Blog,
  })
  .compile();
```

For example, a GraphQL query might then look like:

```
query getUsersBlogs {
  fetchUser(id: "1") {
    name
    blogs {
      id
      title
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
Both `belongsTo` and `hasOne` are for modeling **1:1** and **1:M** relationships. In the example above, the `blog` type belongs to a `user` type via the `author` field.

Micrograph will generate an `author` field on the `Blog` type that points to a `User` type.

What's the difference between `belongsTo` and `hasOne`?

Nothing, really. They both represent **1:1** relationships, and `cohere` includes both mainly for use by the database layer. For example, we typically use `belongsTo` on a piece of data that we consider to be **dependent**. In other words, the existence of a `blog` depends on the existence of a `user`. A blog cannot exist without an author. In contrast, a `user` might have a `company` relationship:
```javascript
...
relationships: {
  blogs: ...,
  company: hasOne('company', 'employees', {...}),
},
...
```
In this example, it doesn't make sense for a `user` to belong to a company because a user might be unemployed.

Micrograph handles `belongsTo` and `hasOne` relationships identically, and their use cases are left to the developer. For example, you might use `belongsTo` or `hasOne` to specify which table has the foreign key, how cascade deletion works, or which NoSQL collection has an index.

### Resolving relationships
Micrograph expects every model to have a corresponding instance method that matches the relationship's name. For example, if a user has many blogs, then the `User` class should have a `blogs` method.

```js
import db from './database';

class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    ...
  }

  blogs(args, ctx) {
    return db.blogs.find({ author: this.id });
  }
}
```

If a schema type declares that it has a certain relationship, but the class does not have an instance method with a matching name, Micrograph will always resolve that relationship as `null`.

### Overriding a relationship's output type
Micrograph creates a `[Blog]` type automatically for `hasMany` relationships. You can override the output, however. You can do things like have support Relay connections:

```js
// schema.js
...
schema.defineType('user', {
  attributes: {
    name: GraphQLString,
  },
  relationships: {
    blogs: hasMany('blog', 'author', {
      output: createConnectionType,
    });
  },
});
...
```

You can also transform the relationship data right in the schema without having to mess with your business-logic layer. So, if the `User` class's `blogs` method returns a normal array, you have an opportunity to transform it into the shape required by your `output` key:

```js
// schema.js
...
schema.defineType('user', {
  attributes: {
    name: GraphQLString,
  },
  relationships: {
    blogs: hasMany('blog', 'author', {
      output: createConnectionType,
      transform: connectionFromArray,
    });
  },
});
...
```

Just like root queries and root mutations, you can specify `args` for each relationship:

```js
// schema.js
...
schema.defineType('user', {
  attributes: {
    name: GraphQLString,
  },
  relationships: {
    blogs: hasMany('blog', 'author', {
      output: createConnectionType,
      transform: connectionFromArray,
      args: connectionArgs,
    });
  },
});
...
```

The `blogs` relationship is no longer a `[Blog]` type. It's now a `BlogConnection` type. Check out [an example Relay app](https://github.com/dylnslck/micrograph/tree/master/example/relay).
