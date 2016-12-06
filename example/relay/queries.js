import {
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';

import { connectionArgs, connectionFromArray } from 'graphql-relay';
import createConnectionType from './createConnectionType';
import titleize from './titleize';

export default (type) => ({
  [`find${titleize(type.inflection)}`]: {
    args: connectionArgs,
    output: createConnectionType,
    description: `Finds all ${type.inflection}.`,
    actions: {
      resolve(args, ctx) {
        return type.model.find(args, ctx)
          .then(data => (ctx.data = data));
      },

      finalize(args, ctx) {
        return connectionFromArray(ctx.data, args);
      },

      error(err) {
        // eslint-disable-next-line
        console.log('Error logger!:', err);
      },
    },
  },

  [`findOne${titleize(type.name)}`]: {
    description: `Finds all ${type.inflection}.`,
    args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    actions: {
      resolve(args, ctx) {
        return type.model.findOne(args, ctx)
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
