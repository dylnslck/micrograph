 ![](assets/logo.svg)
# Micrograph
![](https://travis-ci.org/directlyio/micrograph.svg?branch=master) [![codecov](https://codecov.io/gh/directlyio/micrograph/branch/master/graph/badge.svg)](https://codecov.io/gh/directlyio/micrograph)

Micrograph is middle framework for developing large GraphQL applications with complex business logic. Micrograph enables easy type-to-query and type-to-mutation mappings that scale without boilerplate.
## Motivation {#motivation}

Large GraphQL schemas quickly become cumbersome and hard to manage. Duplication invariably occurs across different GraphQL object types and creating and maintaining a [DRY](https://en.wikipedia.org/wiki/Don't_repeat_yourself) GraphQL codebase is rather difficult. Additionally, the GraphQL documentation doesn't cover complex middleware outside of basic Express authentication.

Micrograph is an attempt to reduce GraphQL boilerplate and duplication by relying on the simpler Cohere schema library that declares **attributes** and **relationships**. Micrograph then compiles that to a GraphQL schema that can be plugged into express-graphql, et al. Additionally, Micrograph supports middleware hooks that make writing business logic pretty easy.

## Getting started {#getting-started}

First, install the Micrograph package. Micrograph relies on the Cohere schema library, so install that as well. Cohere is a simple ~250 LOC schema lib.

```bash
npm install micrograph --save
npm install cohere --save
```

Now, we need to define the schema, queries, mutations, and middleware. These steps are outlined in the tutorial.
