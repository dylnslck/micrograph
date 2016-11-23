import {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} from 'graphql';

import creationInputType from './creationInputType';
import flattenNode from './flattenNode';
import titleize from './titleize';

export default (type) => ({
  [`create${titleize(type.name)}`]: {
    description: `Creates a ${type.name}.`,
    args: {
      input: { type: creationInputType(type) },
    },
    actions: {
      resolve(args, ctx, next) {
        ctx.model(type.name).create(args.input).then(data => {
          ctx.data = data;
          next();
        });
      },

      finalize(ctx) {
        return flattenNode(ctx.data);
      },

      error(err) {
        // eslint-disable-next-line
        console.log('Error logger!:', err);
      },
    },
  },

  [`update${titleize(type.name)}`]: {
    description: `Updates a ${type.name}'s attributes.`,
    args: {
      input: { type: creationInputType(type) },
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    actions: {
      resolve(args, ctx, next) {
        ctx.model(type.name).update(args.id, args.input).then(data => {
          ctx.data = data;
          next();
        });
      },

      finalize(ctx) {
        return flattenNode(ctx.data);
      },

      error(err) {
        // eslint-disable-next-line
        console.log('Error logger!:', err);
      },
    },
  },

  [`archive${titleize(type.name)}`]: {
    description: `Deletes a ${type.name}.`,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
    },
    actions: {
      resolve(args, ctx, next) {
        ctx.model(type.name).fetch(args.id)
          .then(node => node.archive())
          .then(node => (ctx.data = node))
          .then(next);
      },

      finalize(ctx) {
        return flattenNode(ctx.data);
      },

      error(err) {
        // eslint-disable-next-line
        console.log('Error logger!:', err);
      },
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
              id: { type: new GraphQLNonNull(GraphQLID) },
              nodes: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) },
            },
            actions: {
              resolve(args, ctx, next) {
                ctx.model(type.name).fetch(args.id)
                  .then(node => node.push(field, args.nodes))
                  .then(node => (ctx.data = node))
                  .then(next);
              },

              finalize(ctx) {
                return flattenNode(ctx.data);
              },

              error(err) {
                // eslint-disable-next-line
                console.log('Error logger!:', err);
              },
            },
          },

          [`splice${titleize(type.meta.inflection)}${titleize(field)}`]: {
            description: 'Splice ids.',
            args: {
              id: { type: new GraphQLNonNull(GraphQLID) },
              nodes: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) },
            },
            actions: {
              resolve(args, ctx, next) {
                ctx.model(type.name).fetch(args.id)
                  .then(node => node.put(field, args.nodes))
                  .then(node => (ctx.data = node))
                  .then(next);
              },

              finalize(ctx) {
                return flattenNode(ctx.data);
              },

              error(err) {
                // eslint-disable-next-line
                console.log('Error logger!:', err);
              },
            },
          },
        };

      case 'hasOne':
        return {
          ...accumulator,

          [`put${titleize(type.meta.inflection)}${titleize(field)}`]: {
            description: 'Sets an id.',
            args: {
              id: { type: new GraphQLNonNull(GraphQLID) },
              node: { type: new GraphQLNonNull(GraphQLID) },
            },
            actions: {
              resolve(args, ctx, next) {
                ctx.model(type.name).fetch(args.id)
                  .then(node => node.put(field, args.node))
                  .then(node => (ctx.data = node))
                  .then(next);
              },

              finalize(ctx) {
                return flattenNode(ctx.data);
              },

              error(err) {
                // eslint-disable-next-line
                console.log('Error logger!:', err);
              },
            },
          },

          [`remove${titleize(type.meta.inflection)}${titleize(field)}`]: {
            description: 'Removes an id.',
            args: {
              id: { type: new GraphQLNonNull(GraphQLID) },
              node: { type: new GraphQLNonNull(GraphQLID) },
            },
            actions: {
              resolve(args, ctx, next) {
                ctx.model(type.name).fetch(args.id)
                  .then(node => node.remove(field, args.node))
                  .then(node => (ctx.data = node))
                  .then(next);
              },

              finalize(ctx) {
                return flattenNode(ctx.data);
              },

              error(err) {
                // eslint-disable-next-line
                console.log('Error logger!:', err);
              },
            },
          },
        };

      default:
        return accumulator;
    }
  }, {}),
});
