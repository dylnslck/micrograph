import { GraphQLObjectType, GraphQLID } from 'graphql';
import buildAttributes from './buildAttributes';
import buildRelationships from './buildRelationships';
import titleizeType from './titleizeType';

const getDefaultDescription = (name) => `The ${titleizeType(name)} Cohere model.`;

export default (schema) => {
  const graphQLObjectTypes = schema.types.reduce((prev, type) => {
    const { meta, name } = type;

    if (!meta) {
      throw new Error(
        'Micrograph requires every defined type to have a valid meta key. The ' +
        `${name} type did not have a meta key.`
      );
    }

    return {
      ...prev,
      [name]: new GraphQLObjectType({
        description: meta.description || getDefaultDescription(name),
        name: `${titleizeType(name)}`,
        fields: () => ({
          id: { type: GraphQLID },
          ...buildAttributes(type),
          ...buildRelationships(type, graphQLObjectTypes),
        }),
      }),
    };
  }, {});

  return graphQLObjectTypes;
};
