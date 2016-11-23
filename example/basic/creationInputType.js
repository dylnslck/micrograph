import {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInputObjectType,
} from 'graphql';

const cache = {};
const titleize = (str) => `${str[0].toUpperCase()}${str.slice(1)}`;

const creationInputType = (type) => {
  const { name, attributes, relationships } = type;

  if (cache.hasOwnProperty(name)) return cache[name];

  const attributeFields = attributes.reduce((prev, { field, type: attrType }) => ({
    ...prev,
    [field]: { type: attrType },
  }), {});

  const relationshipFields = relationships.reduce((prev, relationship) => {
    const { field, relation, inverse } = relationship;
    let inputType;

    switch (relation) {
      case 'hasMany':
        if (inverse.relation === 'hasMany') {
          inputType = new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID)));
        } else {
          inputType = new GraphQLList(new GraphQLNonNull(GraphQLID));
        }
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

  cache[name] = new GraphQLInputObjectType({
    name: `${titleize(name)}Input`,
    fields: {
      ...attributeFields,
      ...relationshipFields,
    },
  });

  return cache[name];
};

export default creationInputType;
