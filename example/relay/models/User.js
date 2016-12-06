import Blog from './Blog';

function checkCanSee() {
  return true;
}

export default class User {
  constructor(data) {
    this.id = data._id; // eslint-disable-line
    this.name = data.name;
    this.email = data.email;
  }

  static gen(args, ctx, data) {
    return checkCanSee(ctx, args, data) ? new User(data) : null;
  }

  static findOne(args, ctx) {
    return new Promise((resolve, reject) => {
      ctx.db.user.findOne({ _id: args.id }, (err, doc) => {
        if (err) return reject(err);
        return User.gen(args, ctx, doc);
      });
    });
  }

  static find(args, ctx) {
    return new Promise((resolve, reject) => {
      ctx.db.user.find({}, (err, docs) => {
        if (err) {
          reject(err);
          return null;
        }

        if (!docs) return [];
        return resolve(docs.map(user => User.gen(args, ctx, user)));
      });
    });
  }

  static insert(args, ctx) {
    return new Promise(resolve => {
      ctx.db.user.insert(args.input, (err, doc) => {
        resolve(User.gen(args, ctx, doc));
      });
    });
  }

  static update(args, ctx) {
    return new Promise(resolve => {
      ctx.db.user.update({ _id: args.id }, { $set: args.input }, (err, numUpdated) => {
        resolve(numUpdated);
      });
    });
  }

  static remove(args, ctx) {
    return new Promise(resolve => {
      ctx.db.user.remove({ _id: args.id }, (err, numRemoved) => {
        resolve(numRemoved);
      });
    });
  }

  blogs(args, ctx) {
    return new Promise((resolve, reject) => {
      ctx.db.blog.find({ author: this.id }, (err, docs) => {
        if (err) return reject(err);
        return resolve(docs.map(doc => Blog.gen(args, ctx, doc)));
      });
    });
  }
}
