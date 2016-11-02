import { GraphQLObjectType, GraphQLNonNull, GraphQLID } from 'graphql';
import buildInputType from './buildInputType';
import flattenAttributes from './flattenAttributes';
import ensureContextHasModel from './ensureContextHasModel';
import titleizeType from './titleizeType';

export default (schemas, types) => new GraphQLObjectType({
  name: 'Mutation',
  fields: () => Object.keys(schemas).reduce((prev, curr) => {
    const inputType = buildInputType(curr, schemas[curr]);

    return {
      ...prev,

      // create a new resource
      [`create${titleizeType(curr)}`]: {
        type: types[curr],
        args: {
          input: { type: new GraphQLNonNull(inputType) },
        },
        resolve(root, args, ctx) {
          ensureContextHasModel(ctx);
          return ctx.model(curr).create(args.input).then(flattenAttributes);
        },
      },

      // update an existing resource
      [`update${titleizeType(curr)}`]: {
        type: types[curr],
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          input: { type: new GraphQLNonNull(inputType) },
        },
        resolve(root, args, ctx) {
          ensureContextHasModel(ctx);
          return ctx.model(curr)
            .fetchResource(args.id)
            .then(resource => resource.update(args.input))
            .then(flattenAttributes);
        },
      },
    };
  }, {}),
});
