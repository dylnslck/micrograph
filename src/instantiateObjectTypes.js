import {
  GraphQLObjectType,
  GraphQLID,
} from 'graphql';

import buildAttributes from './buildAttributes';
import buildRelationships from './buildRelationships';
import titleizeType from './titleizeType';

const getDefaultDescription = (name) => `The ${titleizeType(name)} Cohere model.`;
const typeCache = {};

export default (schema) => {
  const graphQLObjectTypes = schema.types.reduce((prev, type) => {
    const { meta, name } = type;

    if (!meta) {
      throw new Error(
        'Micrograph requires every defined type to have a valid meta key. The ' +
        `${name} type did not have a meta key.`
      );
    }

    if (typeCache.hasOwnProperty(name)) return prev;
    typeCache[name] = true;

    return {
      ...prev,
      [name]: new GraphQLObjectType({
        description: meta.description || getDefaultDescription(name),
        name: `${titleizeType(name)}`,
        fields: () => ({
          // dynamic fields
          ...buildAttributes(type),
          ...buildRelationships(type, graphQLObjectTypes),

          // static fields, make sure they aren't overwritten
          id: { type: GraphQLID },
        }),
      }),
    };
  }, {});

  return graphQLObjectTypes;
};
