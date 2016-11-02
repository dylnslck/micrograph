import { GraphQLObjectType, GraphQLID } from 'graphql';
import buildAttributes from './buildAttributes';
import buildRelationships from './buildRelationships';
import titleizeType from './titleizeType';

const getDefaultDescription = (name) => `A '${name}' Redink model.`;

export default (schemas) => {
  const types = Object.keys(schemas).reduce((prev, curr) => {
    const { meta } = schemas[curr];

    if (!meta) {
      throw new Error(
        'When using \'redink-graphql\', every schema must have a valid \'meta\' key. The ' +
        `${curr} schema did not have a 'meta' key.`
      );
    }

    const type = new GraphQLObjectType({
      description: meta.description || getDefaultDescription(curr),
      name: `${titleizeType(curr)}`,
      fields: () => ({
        id: { type: GraphQLID },
        ...buildAttributes(schemas, curr),
        ...buildRelationships(schemas, curr, types),
      }),
    });

    return {
      ...prev,
      [curr]: type,
    };
  }, {});

  return types;
};
