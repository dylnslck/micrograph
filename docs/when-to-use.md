# When should I use Micrograph
Micrograph is great when you need to automate the exposure of a large subset of your business-logic. If you notice that you're rewriting a lot of similar code across your application (similar CRUD operations, for example), then Micrograph is helpful.

Micrograph is not helpful if you need to worry about specialized queries or auth. Micrograph is great when you need to generalize root queries and root mutations across every type in your data model. That doesn't make sense for auth (i.e. a `me` query or `loggedInUser` query). Auth queries are usually particular to a single type, i.e. the `user` type. It doesn't make sense to generalize auth across the `blog` and `comment` type for example. My recommendation is so to separate your auth from your main GraphQL application entirely, and I believe that's the general recommendation of the Apollo and GraphQL team.

However, once the client is authenticated, you can pass in the client's JWT or whatever into your Micrograph app's `ctx` object. Then your business-logic becomes responsible for reconciling that `ctx` object and determining its own visibility.
