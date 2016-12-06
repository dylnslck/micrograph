import db from '../database';
import Blog from './Blog';

export default class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
  }

  static getAll() {
    return db().getAll('user')
      .then(({ data }) => data.map(user => new User(user)));
  }

  static get(args) {
    return db().get('user', args.id)
      .then(({ data }) => new User(data));
  }

  static create(args) {
    const id = `${Date.now()}`;
    const input = {
      ...args.input,
      id,
    };

    return db().set('user', id, input)
      .then(res => res.data)
      .then(user => new User(user));
  }

  blogs() {
    return db().getAll('blog')
      .then(res => res.data)
      .then(blogs => blogs.filter(({ author }) => author === this.id))
      .then(blogs => blogs.map(blog => new Blog(blog)));
  }
}
