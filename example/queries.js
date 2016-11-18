import {
  GraphQLNonNull,
  GraphQLID,
} from 'graphql';

import optionsInputType from './optionsInputType';
import titleize from './titleize';

export default (type) => ({
  [`find${titleize(type.meta.inflection)}`]: {
    isPlural: true,
    description: `Finds all ${type.meta.inflection}.`,
    args: {
      options: { type: optionsInputType },
    },
  },

  [`fetch${titleize(type.name)}`]: {
    description: `Finds all ${type.meta.inflection}.`,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
  },
});
