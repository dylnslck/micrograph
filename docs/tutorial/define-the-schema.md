# Define the schema

Micrograph uses the [cohere](https://github.com/directlyio/cohere) schema lib. `cohere` is a tiny lib that compiles attributes and relationships to JSON that is easily transformed into a GraphQL schema, among other things.

The following is an example of a basic schema. Refer to the [data modeling](../data-modeling.md) section for more information on creating schemas. We're using [GraphQL scalar types for attributes](http://graphql.org/graphql-js/type/).

```javascript
// schema.js
import Schema, { hasMany, belongsTo } from 'cohere';
import { GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql';
import Blog from './models/Blog';
import User from './models/User';

const schema = new Schema();

schema.defineType('user', {
  attributes: {
    name: { type: GraphQLString },
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  relationships: {
    blogs: hasMany('blog', 'author'),
  },
  model: User,
});

schema.defineType('blog', {
  attributes: {
    title: { type: GraphQLString },
  },
  relationships: {
    author: belongsTo('user', 'blogs'),
  },
  model: Blog,
});

schema.compile();

export default schema;
```

`cohere` offers three relationship types: **hasMany**, **belongsTo**, and **hasOne**. For each relationship, the first argument is the **type** that the relationship refers to, i.e. the user's blogs relationship points to the **blog** type. The second argument is the **inverse field**. For example, the schema above declares that the **author** relationship of a **blog** points to the **user** type and that the **user** type has a **blogs** relationship that points back towards the **blog** type.

The third argument is an optional object.

After defining all your types, you must invoke the **compile** method, which simply links each relationship to each other. Compiling will let you know if you have any schema errors as well \(such as a missing inverse or a relationship that points to an undefined type\). This is useful becuase you'll never accidentally deploy a partially broken schema, which is really easy to do once your schema includes &gt;20 types.
