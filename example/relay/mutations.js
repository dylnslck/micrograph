import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';

import creationInputType from './creationInputType';
import titleize from './titleize';

export default (type) => ({
  [`create${titleize(type.name)}`]: {
    description: `Creates a ${type.name}.`,
    args: {
      input: { type: creationInputType(type) },
    },
    actions: {
      resolve(args, ctx) {
        return type.model.insert(args, ctx)
          .then(data => (ctx.data = data));
      },

      finalize(args, ctx) {
        return ctx.data;
      },

      error(err) {
        // eslint-disable-next-line
        console.log('Error logger!:', err);
      },
    },
  },

  [`update${titleize(type.name)}`]: {
    output: GraphQLInt,
    description: `Updates a ${type.name}'s attributes.`,
    args: {
      input: { type: creationInputType(type) },
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    actions: {
      resolve(args, ctx) {
        return type.model.update(args, ctx)
          .then(numUpdated => (ctx.data = numUpdated));
      },

      finalize(args, ctx) {
        return ctx.data;
      },

      error(err) {
        // eslint-disable-next-line
        console.log('Error logger!:', err);
      },
    },
  },

  [`remove${titleize(type.name)}`]: {
    output: GraphQLInt,
    description: `Deletes a ${type.name}.`,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    actions: {
      resolve(args, ctx) {
        return type.model.remove(args, ctx)
          .then(numRemoved => (ctx.data = numRemoved));
      },

      finalize(args, ctx) {
        return ctx.data;
      },

      error(err) {
        // eslint-disable-next-line
        console.log('Error logger!:', err);
      },
    },
  },
});
