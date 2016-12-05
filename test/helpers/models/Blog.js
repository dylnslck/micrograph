import db from '../database';
import User from './User';

export default class Blog {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.authorId = data.author;
  }

  static typeName = 'blog'

  static getall() {
    return db().getAll('blog')
      .then(({ data }) => data.map(blog => new Blog(blog)));
  }

  static get(args) {
    return db().get('blog', args.id)
      .then(res => new Blog(res));
  }

  static create(args) {
    const id = `${Date.now()}`;
    const input = {
      ...args.input,
      id,
    };

    return db().set('blog', id, input)
      .then(res => res.data)
      .then(blog => new Blog(blog));
  }

  author() {
    return db().get('user', this.authorId)
      .then(res => res.data)
      .then(user => new User(user));
  }
}
