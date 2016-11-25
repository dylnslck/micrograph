import {
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
} from 'graphql';

import normalizeDocument from './normalizeDocument';
import titleize from './titleize';

export default (type) => ({
  [`find${titleize(type.meta.inflection)}`]: {
    output: GraphQLList,
    description: `Finds all ${type.meta.inflection}.`,
    actions: {
      resolve(args, ctx, next) {
        ctx.db[type.name].find({}, (err, docs) => {
          if (err) {
            throw err;
          }

          ctx.data = docs;
          next();
        });
      },

      finalize(ctx) {
        return ctx.data.map(normalizeDocument);
      },

      error(err) {
        // eslint-disable-next-line
        console.log('Error logger!:', err);
      },
    },
  },

  [`fetch${titleize(type.name)}`]: {
    description: `Finds all ${type.meta.inflection}.`,
    args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    actions: {
      resolve(args, ctx, next) {
        ctx.db[type.name].findOne({ _id: args.id }, (err, doc) => {
          if (err) {
            throw err;
          }

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
});
