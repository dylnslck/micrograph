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

    if (!resolvers.hasOwnProperty(createMutationName)) {
      throw new Error(
        `Tried to build the ${createMutationName} root mutation, but the ` +
        `${createMutationName} resolver was not found.`
      );
    }

    if (!resolvers.hasOwnProperty(updateMutationName)) {
      throw new Error(
        `Tried to build the ${updateMutationName} root mutation, but the ` +
        `${updateMutationName} resolver was not found.`
      );
    }

    if (!resolvers.hasOwnProperty(archiveMutationName)) {
      throw new Error(
        `Tried to build the ${archiveMutationName} root mutation, but the ` +
        `${archiveMutationName} resolver was not found.`
      );
    }

    return {
      ...prev,

      // create a new node
      [createMutationName]: {
        type: types[name],
        args: {
          input: { type: new GraphQLNonNull(inputType) },
        },
        resolve(root, args, ctx) {
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
          return handleResolver(args, ctx, resolvers[archiveMutationName], middleware);
        },
      },
    };
  }, {}),
});
