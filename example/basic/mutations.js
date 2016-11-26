import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';

import creationInputType from './creationInputType';
import normalizeDocument from './normalizeDocument';
import titleize from './titleize';

export default (type) => ({
  [`create${titleize(type.name)}`]: {
    description: `Creates a ${type.name}.`,
    args: {
      input: { type: creationInputType(type) },
    },
    actions: {
      resolve(args, ctx, next) {
        ctx.db[type.name].insert(args.input, (err, doc) => {
          ctx.data = doc;
          next();
        });
      },

      finalize(ctx) {
        return normalizeDocument(ctx.data);
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
      resolve(args, ctx, next) {
        ctx.db[type.name].update({ _id: args.id }, { $set: args.input }, (err, numUpdated) => {
          ctx.data = numUpdated;
          next();
        });
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

  [`remove${titleize(type.name)}`]: {
    output: GraphQLInt,
    description: `Deletes a ${type.name}.`,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    actions: {
      resolve(args, ctx, next) {
        ctx.db[type.name].remove({ _id: args.id }, (err, numRemoved) => {
          ctx.data = numRemoved;
          next();
        });
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
