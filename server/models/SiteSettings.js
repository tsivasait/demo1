const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: [true, 'Please add a site name'],
    trim: true
  },
  siteDescription: {
    type: String,
    required: [true, 'Please add a site description']
  },
  logo: {
    type: String,
    default: 'default-logo.png'
  },
  favicon: {
    type: String,
    default: 'default-favicon.ico'
  },
  primaryColor: {
    type: String,
    default: '#3490dc'
  },
  secondaryColor: {
    type: String,
    default: '#38b2ac'
  },
  footerText: {
    type: String,
    default: '© 2023 My Blog. All rights reserved.'
  },
  socialLinks: {
    facebook: {
      type: String,
      default: ''
    },
    twitter: {
      type: String,
      default: ''
    },
    instagram: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    }
  },
  featuredCategories: {
    type: [String],
    default: ['technology', 'lifestyle', 'business']
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Only allow one settings document
SiteSettingsSchema.statics.checkOnlyOne = async function() {
  const count = await this.countDocuments();
  return count <= 1;
};

// Pre-save hook to ensure only one settings document exists
SiteSettingsSchema.pre('save', async function(next) {
  if (!(await this.constructor.checkOnlyOne())) {
    return next(new Error('Only one settings document can exist'));
  }
  next();
});

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);