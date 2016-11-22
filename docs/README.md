 ![](assets/logo.svg)
# Micrograph
![](https://travis-ci.org/directlyio/micrograph.svg?branch=master) [![codecov](https://codecov.io/gh/directlyio/micrograph/branch/master/graph/badge.svg)](https://codecov.io/gh/directlyio/micrograph)

Micrograph is small (~375 LOC) middle framework for developing large GraphQL applications with complex business logic. Micrograph utilizes type-to-query and type-to-mutation mappings that enable applications to scale without boilerplate and GraphQL bookkeeping.

## Motivation {#motivation}
Large GraphQL schemas quickly become cumbersome and hard to manage. Duplication invariably occurs across different GraphQL object types and creating and maintaining a [DRY](https://en.wikipedia.org/wiki/Don't_repeat_yourself) GraphQL codebase is rather difficult. Additionally, the GraphQL documentation doesn't cover complex middleware outside of basic Express authentication. Micrograph offers a structured way to build complex middleware and to handle business-logic specific errors.

## The gist {#the-gist}
Getting started with Micrograph requires two files: `schema.js` and `queries.js`. You can optionally create two more files: `mutations.js` and `middleware.js`. Micrograph compiles these four files into a `GraphQLSchema` that can be plugged into your favorite GraphQL server library. These files enable your application to grow by focusing on things that matter, such as middleware and additional schema types.

For example, let's say your data model includes users and blogs. You'll build the four files specified above and launch. A week later, you decide to add more types to your data model. With Micrograph, you simply need to edit `schema.js` and add some more middleware hooks if you choose.

![](assets/graph.svg)

Your app's complexity can grow without worrying about creating new GraphQL input types, object types, etc.

## Getting started {#getting-started}
First, install the Micrograph package. Micrograph relies on the [cohere]([cohere](https://github.com/directlyio/cohere) schema library, so install that as well. `cohere` is a simple ~250 LOC schema lib.

```sh
npm install micrograph --save
npm install cohere --save
```

Now, we need to define the schema, queries, mutations, and middleware. These steps are outlined in the tutorial.

## Documentation {#documentation}
1. [Tutorial](tutorial.md)
  1. [Define your schema](tutorial/define-the-schema.md)
  2. [Root queries and mutations](tutorial/root-queries-and-mutations.md)
  3. [Middleware](tutorial/middleware.md)
  4. [Wire everything together](tutorial/wire-everything-together.md)
2. [Data modeling](data-modeling.md)
3. [API](api-reference.md)
  1. [.compile](api/compile.md)
  2. [.createMiddleware](api/create-middleware.md)
