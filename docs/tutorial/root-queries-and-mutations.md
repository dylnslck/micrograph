# Define some root queries and mutations

In order to define your root queries and mutations, you need to create a function that maps a `cohere` type to a series of queries and mutations.

## `queries.js`

```javascript
import { GraphQLNonNull, GraphQLID, GraphQLList } from 'graphql';

// convert user -> User
const titleize = (str) => `${str[0].toUpperCase()}${str.slice(1)}`;

export default (type) => ({
  // fetchUser and fetchBlog
  [`fetch${titleize(type.name)}`]: {
    description: `Retrieves a single ${type.name}`,
    args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    actions: {
      resolve: (args, ctx, next) => ctx.db(type.name)
        .fetch(args.id)
        .then(data => ctx.data = data)
        .then(next),
      finalize: (ctx) => ctx.data,
      error: (err) => console.log(err),
    },
  },
  // findUsers and findBlogs
  [`find${titleize(type.name)}s`]: {
    output: GraphQLList,
    description: `Finds all ${type.name} types`,
    actions: {
      resolve: (args, ctx, next) => ctx.db(type.name)
        .find()
        .then(data => ctx.data = data)
        .then(next),
      finalize: (ctx) => ctx.data,
      error: (err) => console.log(err),
    },
  },
});
```

Every type defined in `schema.js` is mapped to the following queries: **fetchUser**, **fetchBlog**, **findUsers**, and **findBlogs**. Micrograph expects the exported function to return an object whose keys are the root query names and whose values are an object with optional `description`, `args`, and `output` keys. The fourth key `actions` has a required `resolve` key and optional `finalize` and `error` keys.

1. `description` is the GraphQL description
2. `args` is a valid GraphQL args object
3. `output` is a valid GraphQL wrapper (like GraphQLList) or a function that takes in a GraphQL object type and returns an output type, i.e. `output: (type) => new GraphQLList(type)`
4. `actions` is an object of methods used for resolving, preparing responses, and handling errors
  1. `resolve` is the method (located in the middle of the middleware chain) that handles data fetching
  2. `finalize` is the method that transforms `ctx` into an object that matches the output type
  3. `error` is error handler

## `mutations.js`

```javascript
import { GraphQLInputObjectType, GraphQLID, GraphQLNonNull } from 'graphql';
let inputObjectCache = {};

// convert user -> User
const titleize = (str) => `${str[0].toUpperCase()}${str.slice(1)}`;

// map a type to a GraphQLInputObjectType
const createInputObject = (type) => {
  if (inputObjectCache.hasOwnProperty(type.name)) return inputObjectCache[type.name];

  const inputObject = new GraphQLInputObjectType({
    // BlogInput and UserInput
    name: `${titleize(type.name)}Input`,
    fields: () => type.attributes.reduce((accumulator, { field, type }) => ({
      ...accumulator,
      [field]: { type },
    }), {}),
  });

  inputObjectCache[type.name] = inputObject;
  return inputObject;
};

export default (type) => ({
  // createUser and createBlog
  [`create${titleize(type.name)}`]: {
    description: `Creates a ${type.name}`,
    args: {
      input: { type: createInputObject(type) },
    },
    actions: {
      resolve: (args, ctx, next) => ctx.db(type.name),
        .create(args.input)
        .then(data => ctx.data = data),
        .then(next),
      finalize: (ctx) => ctx.data
    },
  },
  // updateUser and updateBlog
  [`update${titleize(type.name)}`]: {
    description: `Updates a ${type.name}`,
    args: {
      input: { type: createInputObject(type) },
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    actions: {
      resolve: (args, ctx, next) => ctx.db(type.name)
        .update(args.id, args.input)
        .then(data => ctx.data = data)
        .then(next),
      finalize: (ctx) => ctx.data,
    },
  },
});
```

Every type defined in `schema.js` is mapped to the following mutations: **createUser**, **updateUser**, **createBlog**, and **updateBlog**. The `createInputObject` function in the example maps a type's attributes into a GraphQL input object type, which is passed into `args.input`. `inputObjectCache` in the example is required so that multiple input object types of the same name are not created, otherwise GraphQL will throw an error.

The `queries.js` and `mutations.js` files are probably the most complex files in an entire Micrograph application, but they only need to be written once. They will rarely change, and your application can continue to grow by creating more types in `schema.js`.
