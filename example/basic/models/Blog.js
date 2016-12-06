import User from './User';

function checkCanSee() {
  return true;
}

export default class Blog {
  constructor(data) {
    this.id = data._id; // eslint-disable-line
    this.title = data.title;
    this.content = data.content;
    this.authorId = data.author;
  }

  static gen(args, ctx, data) {
    return checkCanSee(args, ctx, data) ? new Blog(data) : null;
  }

  static findOne(args, ctx) {
    return new Promise((resolve, reject) => {
      ctx.db.blog.findOne({ _id: args.id }, (err, doc) => {
        if (err) return reject(err);
        return Blog.gen(args, ctx, doc);
      });
    });
  }

  static find(args, ctx) {
    return new Promise((resolve, reject) => {
      ctx.db.blog.find({}, (err, docs) => {
        if (err) return reject(err);

        if (!docs) return [];
        return resolve(docs.map(doc => Blog.gen(args, ctx, doc)));
      });
    });
  }

  static insert(args, ctx) {
    return new Promise((resolve, reject) => {
      ctx.db.blog.insert(args.input, (err, doc) => {
        if (err) return reject(err);
        return resolve(Blog.gen(args, ctx, doc));
      });
    });
  }

  static update(args, ctx) {
    return new Promise((resolve, reject) => {
      ctx.db.blog.update({ _id: args.id }, { $set: args.input }, (err, numUpdated) => {
        if (err) return reject(err);
        return resolve(numUpdated);
      });
    });
  }

  static remove(args, ctx) {
    return new Promise((resolve, reject) => {
      ctx.db.blog.remove({ _id: args.id }, (err, numRemoved) => {
        if (err) return reject(err);
        return resolve(numRemoved);
      });
    });
  }

  author(args, ctx) {
    return new Promise((resolve, reject) => {
      ctx.db.user.findOne({ _id: this.authorId }, (err, doc) => {
        if (err) return reject(err);
        return resolve(User.gen(args, ctx, doc));
      });
    });
  }
}
