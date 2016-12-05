import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
} from 'graphql';

import titleize from './titleize';

export default (type) => ({
  [`find${titleize(type.meta.inflection)}`]: {
    output: GraphQLList,
    description: `Finds all ${type.meta.inflection}.`,
    actions: {
      resolve(args, ctx) {
        return type.meta.model.find(args, ctx)
          .then(data => (ctx.data = data));
      },

      finalize(ctx) {
        return ctx.data;
      },

      error(err) {
        // eslint-disable-next-line
        console.log('Error logger!:', err);
      },
    },
  },

  [`findOne${titleize(type.name)}`]: {
    description: `Finds all ${type.meta.inflection}.`,
    args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    actions: {
      resolve(args, ctx) {
        return type.meta.model.findOne(args, ctx)
          .then(data => (ctx.data = data));
      },

      finalize(ctx) {
        return ctx.data;
      },

      error(err) {
        // eslint-disable-next-line
        console.log('Error logger!:', err);
      },
    },
  },
});
