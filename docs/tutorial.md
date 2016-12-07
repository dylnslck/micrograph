# Tutorial
The tutorial assumes that you're familiar with ES2015 concepts like [computed keys](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names), [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions#Arrow_functions), and [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

In this tutorial, we're going to create two JavaScript classes: `User` and `Blog`, and four files: `schema.js`, `queries.js`, `mutations.js`, `middleware.js`, and the `index.js` entry file. Then, we'll use them to compile a `GraphQLSchema` and plug it into
[express-graphql](https://github.com/graphql/express-graphql). The tutorial assumes that you have an empty, `npm` project already initialized.

```
mkdir models
touch index.js schema.js queries.js mutations.js middleware.js models/User.js models/Blog.js
```

1. [Define your business-logic layer](tutorial/define-business-logic.html)
2. [Define your schema](tutorial/define-the-schema.html)
3. [Root queries and mutations](tutorial/root-queries-and-mutations.html)
4. [Middleware](tutorial/middleware.html)
5. [Wire everything together](tutorial/wire-everything-together.html)

If you don't really care for tutorials and just want to see some code, you can check out an example [basic Micrograph app](https://github.com/dylnslck/micrograph/tree/master/example/basic) and an example [Relay Micrograph app](https://github.com/dylnslck/micrograph/tree/master/example/relay).
