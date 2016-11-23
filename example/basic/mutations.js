import {
  GraphQLID,
  GraphQLNonNull,
} from 'graphql';

import creationInputType from './creationInputType';
import flattenNode from './flattenNode';
import titleize from './titleize';

export default (type) => ({
  [`create${titleize(type.name)}`]: {
    description: `Creates a ${type.name}.`,
    args: {
      input: { type: creationInputType(type) },
    },
    actions: {
      resolve(args, ctx, next) {
        ctx.model(type.name).create(args.input).then(data => {
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

  [`update${titleize(type.name)}`]: {
    description: `Updates a ${type.name}'s attributes.`,
    args: {
      input: { type: creationInputType(type) },
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    actions: {
      resolve(args, ctx, next) {
        ctx.model(type.name).update(args.id, args.input).then(data => {
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

  [`archive${titleize(type.name)}`]: {
    description: `Deletes a ${type.name}.`,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    actions: {
      resolve(args, ctx, next) {
        ctx.model(type.name).fetch(args.id)
          .then(node => node.archive())
          .then(node => (ctx.data = node))
          .then(next);
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
