import {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInputObjectType,
} from 'graphql';

import titleizeType from './titleizeType';

export default (type, schema) => {
  const { attributes, relationships } = schema;

  const attributeFields = Object.keys(attributes).reduce((prev, curr) => ({
    ...prev,
    [curr]: { type: attributes[curr] },
  }), {});

  const relationshipFields = Object.keys(relationships).reduce((prev, curr) => {
    const { relation } = relationships[curr];
    let inputType;

    switch (relation) {
      case 'hasMany':
        inputType = new GraphQLList(new GraphQLNonNull(GraphQLID));
        break;

      case 'hasOne':
        inputType = GraphQLID;
        break;

      case 'belongsTo':
        inputType = new GraphQLNonNull(GraphQLID);
        break;

      default:
        inputType = GraphQLID;
    }

    return {
      ...prev,
      [curr]: { type: inputType },
    };
  }, {});

  return new GraphQLInputObjectType({
    name: `${titleizeType(type)}Input`,
    fields: {
      ...attributeFields,
      ...relationshipFields,
    },
  });
};
