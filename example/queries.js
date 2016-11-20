import {
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';

import optionsInputType from './optionsInputType';
import flattenConnection from './flattenConnection';
import flattenNode from './flattenNode';
import titleize from './titleize';

export default (type) => ({
  [`find${titleize(type.meta.inflection)}`]: {
    isPlural: true,
    description: `Finds all ${type.meta.inflection}.`,
    args: {
      options: { type: optionsInputType },
    },
    actions: {
      resolve(args, ctx, next) {
        ctx.model(type.name).find(args.options).then(data => {
          ctx.data = data;
          next();
        });
      },

      finalize(ctx) {
        return flattenConnection(ctx.data);
      },

      error(err) {
        // eslint-disable-next-line
        console.log('Error logger!:', err);
      },
    },
  },

  [`fetch${titleize(type.name)}`]: {
    description: `Finds all ${type.meta.inflection}.`,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    actions: {
      resolve(args, ctx, next) {
        ctx.model(type.name).fetch(args.id).then(data => {
          ctx.data = data;
          next();
        });
      },

      finalize(ctx) {
        return flattenNode(ctx.data);
      },

      error(err) {
        // eslint-disable-next-line
        console.log('Error logger!:', err);
      },
    },
  },
});
