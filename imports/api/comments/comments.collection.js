import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import commentsCountDenormalizer from './commentsCountDenormalizer.js';

class CommentsCollection extends Mongo.Collection {
  insert(doc, callback) {
    const comment = doc;
    const result = super.insert(comment, callback);
    commentsCountDenormalizer.afterInsertComment(comment);
    return result;
  }
}

const Comments = new CommentsCollection('Comments');

Comments.Schema = new SimpleSchema({
  authorId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  authorName: {
    type: String,
  },
  pinId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  text: {
    type: String,
  },
});

Comments.attachSchema(Comments.Schema);

export { Comments };
