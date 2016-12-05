import Schema from 'cohere';

export default class MicrographSchema {
  constructor() {
    this.schema = new Schema();
  }

  defineType(model, options) {
    const { meta } = options;
    const { typeName } = model;

    if (!typeName) {
      throw new Error('Please provide a static typeName variable when creating your models.');
    }

    this.schema.defineType(typeName, {
      ...options,
      meta: {
        ...meta,
        model,
      },
    });

    return this;
  }

  compile() {
    return this.schema.compile();
  }
}

export { hasMany } from 'cohere';
export { belongsTo } from 'cohere';
export { hasOne } from 'cohere';
