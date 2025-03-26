const mongoose = require('mongoose');
const slugify = require('slugify');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: String,
  excerpt: {
    type: String,
    required: [true, 'Please add an excerpt'],
    maxlength: [200, 'Excerpt cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  coverImage: {
    type: String,
    required: [true, 'Please add a cover image']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['food', 'travel', 'social-media', 'news', 'international', 'facts']
  },
  tags: {
    type: [String],
    required: false
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create post slug from the title
PostSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Cascade delete comments when a post is deleted
PostSchema.pre('remove', async function(next) {
  await this.model('Comment').deleteMany({ post: this._id });
  next();
});

// Reverse populate with comments
PostSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  justOne: false
});

module.exports = mongoose.model('Post', PostSchema);