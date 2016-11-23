# Tutorial
The tutorial assumes that you're familiar with ES2015 concepts like [computed keys](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names), [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions#Arrow_functions), and [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

In this tutorial, we're going to create four files: `schema.js`, `queries.js`, `mutations.js`, `middleware.js`, and the `index.js` entry file. Then, we'll use them to compile a `GraphQLSchema` and plug it into
[express-graphql](https://github.com/graphql/express-graphql). The tutorial assumes that you have an empty, `npm` project already initialized.

```
touch index.js schema.js queries.js mutations.js middleware.js
```

1. [Define your schema](tutorial/define-the-schema.html)
2. [Root queries and mutations](tutorial/root-queries-and-mutations.html)
3. [Middleware](tutorial/middleware.html)
4. [Wire everything together](tutorial/wire-everything-together.html)
