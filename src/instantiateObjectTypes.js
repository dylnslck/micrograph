import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
} from 'graphql';

import buildAttributes from './buildAttributes';
import buildRelationships from './buildRelationships';
import titleizeType from './titleizeType';

const getDefaultDescription = (name) => `The ${titleizeType(name)} model.`;
const typeCache = {};

export default (schema) => {
  const objectTypes = schema.types.reduce((prev, type) => {
    const { meta, name } = type;

    if (typeCache.hasOwnProperty(name)) return prev;
    typeCache[name] = true;

    return {
      ...prev,
      [name]: new GraphQLObjectType({
        description: meta && meta.description || getDefaultDescription(name),
        name: `${titleizeType(name)}`,
        fields: () => ({
          // dynamic fields
          ...buildAttributes(type),
          ...buildRelationships(type, objectTypes),

          // static fields, make sure they aren't overwritten
          id: { type: new GraphQLNonNull(GraphQLID) },
        }),
      }),
    };
  }, {});

  return objectTypes;
};
