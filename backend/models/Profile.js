const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    username: {type: String, required: true, unique: true, trim: true},
    profile_image_url: {
      type: String,
      default: '/assets/male-avatar-img.png',
    },
    short_bio: {
      type: String,
      default: 'Full Stack MERN Developer building amazing applications.',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Profile', profileSchema);