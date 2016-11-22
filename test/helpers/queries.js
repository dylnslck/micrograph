import { GraphQLID } from 'graphql';
import errorLogger from './errorLogger';
import db from './database';

export default (type) => ({
  [`fetch${type.name}`]: {
    args: { id: { type: GraphQLID } },
    actions: {
      finalize: (ctx) => ctx.res.data,
      error: (err) => errorLogger().add(err),
      resolve: (args, ctx, next) => db().get(type.name, args.id)
        .then(res => (ctx.res = res))
        .then(next),
    },
  },
  [`all${type.name}s`]: {
    isPlural: true,
    actions: {
      finalize: (ctx) => ({
        totalCount: ctx.res.data.length,
        edges: ctx.res.data.map(node => ({ node })),
      }),
      error: (err) => errorLogger().add(err),
      resolve: (args, ctx, next) => db().getAll(type.name)
        .then(res => (ctx.res = res))
        .then(next),
    },
  },
});
