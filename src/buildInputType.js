import {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInputObjectType,
} from 'graphql';

import titleizeType from './titleizeType';

export default (name, type) => {
  const { attributes, relationships } = type;

  const attributeFields = attributes.reduce((prev, { field, type: attrType }) => ({
    ...prev,
    [field]: { type: attrType },
  }), {});

  const relationshipFields = relationships.reduce((prev, relationship) => {
    const { field, relation } = relationship;

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
      [field]: { type: inputType },
    };
  }, {});

  return new GraphQLInputObjectType({
    name: `${titleizeType(name)}Input`,
    fields: {
      ...attributeFields,
      ...relationshipFields,
    },
  });
};
