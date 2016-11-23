import { GraphQLNonNull, GraphQLID } from 'graphql';
import { connectionDefinitions, connectionArgs } from 'graphql-relay';
import flattenConnection from './flattenConnection';
import flattenNode from './flattenNode';
import titleize from './titleize';

export default (type) => ({
  [`find${titleize(type.meta.inflection)}`]: {
    output: (nodeType) => connectionDefinitions({ nodeType }).connectionType,
    description: `Finds all ${type.meta.inflection}.`,
    args: connectionArgs,
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
