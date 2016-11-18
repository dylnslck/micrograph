import {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} from 'graphql';

import creationInputType from './creationInputType';
import titleize from './titleize';

export default (type) => ({
  [`create${titleize(type.name)}`]: {
    description: `Creates a ${type.name}.`,
    args: {
      input: { type: creationInputType(type) },
    },
  },

  [`update${titleize(type.name)}`]: {
    description: `Updates a ${type.name}'s attributes.`,
    args: {
      input: { type: creationInputType(type) },
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
  },

  [`delete${titleize(type.name)}`]: {
    description: `Deletes a ${type.name}.`,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
  },

  ...type.relationships.reduce((accumulator, relationship) => {
    const { relation, field } = relationship;

    switch (relation) {
      case 'hasMany':
        return {
          ...accumulator,

          [`append${titleize(type.meta.inflection)}${titleize(field)}`]: {
            description: 'Appends ids.',
            args: {
              ids: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) },
            },
          },

          [`splice${titleize(type.meta.inflection)}${titleize(field)}`]: {
            description: 'Splice ids.',
            args: {
              ids: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) },
            },
          },
        };

      case 'hasOne':
        return {
          ...accumulator,

          [`set${titleize(type.meta.inflection)}${titleize(field)}`]: {
            description: 'Sets an id.',
            args: {
              id: { type: new GraphQLNonNull(GraphQLID) },
            },
          },

          [`remove${titleize(type.meta.inflection)}${titleize(field)}`]: {
            description: 'Removes an id.',
            args: {
              id: { type: new GraphQLNonNull(GraphQLID) },
            },
          },
        };

      default:
        return accumulator;
    }
  }, {}),
});
