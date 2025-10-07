const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: {type: String, required: true, trim: true},
    image_url: {type: String, required: true},
  },
  {_id: false},
);

const lifeAtCompanySchema = new mongoose.Schema(
  {
    description: {type: String, required: true},
    image_url: {type: String, required: true},
  },
  {_id: false},
);

const jobSchema = new mongoose.Schema({
  title: { type: String, trim: true, required: true },
  company_logo_url: { type: String, required: true },
  company_website_url: {
    type: String,
    default: 'https://www.google.com',
  },
  employment_type: { type: String, required: true, index: true },
  job_description: { type: String, required: true },
  location: { type: String, required: true },
  package_per_annum: { type: Number, required: true, index: true },
  rating: { type: Number, required: true },
  skills: {
    type: [skillSchema],
    default: [
      {
        name: 'React',
        image_url: '/assets/react-img.png',
      },
      {
        name: 'Node.js',
        image_url: '/assets/node-js-img.png',
      },
    ],
  },
  life_at_company: {
    type: lifeAtCompanySchema,
    default: () => ({
      description: 'Our core philosophy is people over process.',
      image_url: '/assets/life-at-company-img.png',
    }),
  },
}, {
  timestamps: true,
});

// Text index for efficient text searches on title, job_description and location
jobSchema.index({ title: 'text', job_description: 'text', location: 'text' });
jobSchema.index({ employment_type: 1, package_per_annum: -1 });

module.exports = mongoose.model('Job', jobSchema);