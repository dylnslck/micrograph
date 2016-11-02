import { GraphQLList } from 'graphql';
import ensureContextHasModel from './ensureContextHasModel';
import flattenAttributes from './flattenAttributes';

export default (schemas, name, types) => {
  if (!schemas[name]) {
    throw new Error(
      `Tried to build the relationships for the '${name}' schema, but the '${name}' schema was ` +
      'not found.'
    );
  }

  const { type, relationships } = schemas[name];

  return Object.keys(relationships).reduce((prev, curr) => {
    const typeString = relationships[curr].type;
    const { field, relation } = relationships[curr];

    let resolve;
    let graphQLType;

    if (relation === 'hasMany') {
      resolve = (parent, args, ctx) => {
        ensureContextHasModel(ctx);

        return ctx.model(type)
          .findRelated(parent.id, field)
          .then(resources => resources.map(flattenAttributes));
      };

      graphQLType = new GraphQLList(types[typeString]);
    } else {
      resolve = (parent, args, ctx) => {
        ensureContextHasModel(ctx);

        return ctx.model(type)
          .findRelated(parent.id, field)
          .then(flattenAttributes);
      };

      graphQLType = types[typeString];
    }

    return {
      ...prev,
      [curr]: {
        type: graphQLType,
        resolve,
      },
    };
  }, {});
};
