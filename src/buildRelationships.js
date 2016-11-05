import buildConnectionType from './buildConnectionType';
import ensureContextHasModel from './ensureContextHasModel';
import flattenAttributes from './flattenAttributes';
import flattenConnection from './flattenConnection';
import optionsInputType from './optionsInputType';

export default (schemas, name, types) => {
  if (!schemas[name]) {
    throw new Error(
      `Tried to build the relationships for the '${name}' schema, but the '${name}' schema was ` +
      'not found.'
    );
  }

  const { type, relationships } = schemas[name];

  return Object.keys(relationships).reduce((prev, curr) => {
    const typeString = relationships[curr].type;
    const { field, relation } = relationships[curr];

    if (relation === 'hasMany') {
      return {
        ...prev,
        [curr]: {
          type: buildConnectionType(curr, types[typeString]),
          args: {
            options: { type: optionsInputType },
          },
          resolve(parent, args, ctx) {
            ensureContextHasModel(ctx);

            return ctx.model(type)
              .findRelated(parent.id, field, args.options)
              .then(flattenConnection);
          },
        },
      };
    }

    return {
      ...prev,
      [curr]: {
        type: types[typeString],
        resolve(parent, args, ctx) {
          ensureContextHasModel(ctx);

          return ctx.model(type)
            .findRelated(parent.id, field)
            .then(flattenAttributes);
        },
      },
    };
  }, {});
};
