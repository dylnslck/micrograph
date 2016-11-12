import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';

import buildInputType from './buildInputType';
import handleResolver from './handleResolver';
import titleizeType from './titleizeType';

export default (schema, resolvers, middleware, types) => new GraphQLObjectType({
  name: 'Mutation',
  fields: () => schema.types.reduce((prev, type) => {
    const { name } = type;

    const inputType = buildInputType(name, type);
    const createMutationName = `create${titleizeType(name)}`;
    const updateMutationName = `update${titleizeType(name)}`;
    const archiveMutationName = `archive${titleizeType(name)}`;

    return {
      ...prev,

      // create a new node
      [createMutationName]: {
        type: types[name],
        args: {
          input: { type: new GraphQLNonNull(inputType) },
        },
        resolve(root, args, ctx) {
          if (!resolvers.hasOwnProperty(createMutationName)) {
            throw new Error(
              `The ${createMutationName} resolver was never registered.`
            );
          }

          return handleResolver(args, ctx, resolvers[createMutationName], middleware);
        },
      },

      // update an existing node
      [updateMutationName]: {
        type: types[name],
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          input: { type: new GraphQLNonNull(inputType) },
        },
        resolve(root, args, ctx) {
          if (!resolvers.hasOwnProperty(updateMutationName)) {
            throw new Error(
              `The ${updateMutationName} resolver was never registered.`
            );
          }

          return handleResolver(args, ctx, resolvers[updateMutationName], middleware);
        },
      },

      // archive an existing node
      [archiveMutationName]: {
        type: types[name],
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve(root, args, ctx) {
          if (!resolvers.hasOwnProperty(archiveMutationName)) {
            throw new Error(
              `The ${archiveMutationName} resolver was never registered.`
            );
          }

          return handleResolver(args, ctx, resolvers[archiveMutationName], middleware);
        },
      },
    };
  }, {}),
});
