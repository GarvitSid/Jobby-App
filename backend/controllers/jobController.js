const Job = require('../models/Job');
const User = require('../models/User');
const Profile = require('../models/Profile');
const AppError = require('../utils/AppError');
const escapeRegex = require('../utils/escapeRegex');

const defaultProfileImageUrl = '/assets/male-avatar-img.png';
const defaultShortBio = 'Full Stack MERN Developer building amazing applications.';
const defaultJobWebsiteUrl = 'https://www.google.com';
const defaultLifeAtCompany = {
  description: 'Our core philosophy is people over process.',
  image_url: '/assets/home-lg-bg.png',
};
const defaultSkills = [
  {
    name: 'React',
    image_url: '/assets/react-img.png',
  },
  {
    name: 'Node.js',
    image_url: '/assets/react-img.png',
  },
];

const formatJob = job => ({
  id: job._id,
  title: job.title,
  company_logo_url: job.company_logo_url,
  employment_type: job.employment_type,
  job_description: job.job_description,
  location: job.location,
  package_per_annum: job.package_per_annum,
  rating: job.rating,
});

const formatJobDetails = (job, {isSaved = false, isApplied = false} = {}) => ({
  id: job._id,
  title: job.title,
  company_logo_url: job.company_logo_url,
  company_website_url: job.company_website_url || defaultJobWebsiteUrl,
  employment_type: job.employment_type,
  job_description: job.job_description,
  location: job.location,
  package_per_annum: job.package_per_annum,
  rating: job.rating,
  life_at_company: job.life_at_company || defaultLifeAtCompany,
  skills: Array.isArray(job.skills) && job.skills.length > 0 ? job.skills : defaultSkills,
  is_saved: isSaved,
  is_applied: isApplied,
});

const getJobs = async (req, res, next) => {
  const {employment_type, minimum_package, search = '', page = '1', limit = '20'} = req.query;
  const query = {};

  if (search.trim() !== '') {
    // Use MongoDB text search when a text index is present for better performance at scale
    query.$text = { $search: search.trim() };
  }

  if (employment_type && employment_type !== '') {
    query.employment_type = { $in: employment_type.split(',') };
  }

  if (minimum_package) {
    const minimumPackageValue = Number(minimum_package);
    if (Number.isNaN(minimumPackageValue)) {
      return next(new AppError('minimum_package must be a valid number', 400));
    }
    query.package_per_annum = { $gte: minimumPackageValue };
  }

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const skip = (pageNumber - 1) * limitNumber;

  const totalJobs = await Job.countDocuments(query);
  const jobs = await Job.find(query)
    .sort({createdAt: -1, _id: 1})
    .skip(skip)
    .limit(limitNumber);

  return res.json({
    jobs: jobs.map(formatJob),
    total: totalJobs,
    page: pageNumber,
    limit: limitNumber,
    total_pages: Math.ceil(totalJobs / limitNumber),
  });
};

const getJobById = async (req, res, next) => {
  const {id} = req.params;
  const job = await Job.findById(id);

  if (!job) {
    return next(new AppError('Job not found', 404));
  }

  const similarJobs = await Job.find({
    employment_type: job.employment_type,
    _id: { $ne: job._id },
  }).limit(3);

  const user = await User.findOne({username: req.username});
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const jobIdString = job._id.toString();
  const savedJobs = user.saved_jobs || [];
  const appliedJobs = user.applied_jobs || [];
  const isSaved = savedJobs.some(savedJobId => savedJobId.toString() === jobIdString);
  const isApplied = appliedJobs.some(appliedJobId => appliedJobId.toString() === jobIdString);

  const formattedJob = formatJobDetails(job, {isSaved, isApplied});

  return res.json({
    job_details: formattedJob,
    similar_jobs: similarJobs.map(formatJob),
  });
};

const getPaginatedJobsFromCollection = async (req, next, collectionField) => {
  const {page = '1', limit = '20'} = req.query;
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const skip = (pageNumber - 1) * limitNumber;

  const user = await User.findOne({username: req.username}).populate(collectionField);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const jobsCollection = Array.isArray(user[collectionField]) ? user[collectionField] : [];
  const jobs = jobsCollection.slice(skip, skip + limitNumber);

  return {
    jobs: jobs.map(formatJob),
    total: jobsCollection.length,
    page: pageNumber,
    limit: limitNumber,
    total_pages: Math.ceil(jobsCollection.length / limitNumber),
  };
};

const saveJob = async (req, res, next) => {
  const {id} = req.params;
  const job = await Job.findById(id);

  if (!job) {
    return next(new AppError('Job not found', 404));
  }

  const updatedUser = await User.findOneAndUpdate(
    {username: req.username},
    {$addToSet: {saved_jobs: job._id}},
    {returnDocument: 'after'},
  );

  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }

  return res.json({message: 'Job saved successfully'});
};

const applyToJob = async (req, res, next) => {
  const {id} = req.params;
  const job = await Job.findById(id);

  if (!job) {
    return next(new AppError('Job not found', 404));
  }

  const updatedUser = await User.findOneAndUpdate(
    {username: req.username},
    {$addToSet: {applied_jobs: job._id}},
    {returnDocument: 'after'},
  );

  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }

  return res.json({message: 'Job application saved successfully'});
};

const removeSavedJob = async (req, res, next) => {
  const {id} = req.params;
  const job = await Job.findById(id);

  if (!job) {
    return next(new AppError('Job not found', 404));
  }

  const updatedUser = await User.findOneAndUpdate(
    {username: req.username},
    {$pull: {saved_jobs: job._id}},
    {returnDocument: 'after'},
  );

  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }

  return res.json({message: 'Job removed from saved list'});
};

const removeAppliedJob = async (req, res, next) => {
  const {id} = req.params;
  const job = await Job.findById(id);

  if (!job) {
    return next(new AppError('Job not found', 404));
  }

  const updatedUser = await User.findOneAndUpdate(
    {username: req.username},
    {$pull: {applied_jobs: job._id}},
    {returnDocument: 'after'},
  );

  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }

  return res.json({message: 'Application withdrawn successfully'});
};

const getSavedJobs = async (req, res, next) => {
  const collection = await getPaginatedJobsFromCollection(req, next, 'saved_jobs');

  if (!collection) {
    return undefined;
  }

  return res.json(collection);
};

const getAppliedJobs = async (req, res, next) => {
  const collection = await getPaginatedJobsFromCollection(req, next, 'applied_jobs');

  if (!collection) {
    return undefined;
  }

  return res.json(collection);
};

const getProfile = async (req, res) => {
  const profile = await Profile.findOneAndUpdate(
    {username: req.username},
    {
      $setOnInsert: {
        username: req.username,
        profile_image_url: defaultProfileImageUrl,
        short_bio: defaultShortBio,
      },
    },
    {
      upsert: true,
      returnDocument: 'after',
      setDefaultsOnInsert: true,
    },
  );

  return res.json({
    profile_details: {
      name: req.username,
      profile_image_url: profile.profile_image_url || defaultProfileImageUrl,
      short_bio: profile.short_bio || defaultShortBio,
    },
  });
};

const updateProfile = async (req, res, next) => {
  const { profile_image_url, short_bio } = req.body;

  const updated = await Profile.findOneAndUpdate(
    { username: req.username },
    { $set: { profile_image_url, short_bio } },
    { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
  );

  return res.json({ message: 'Profile updated successfully', profile_details: {
    name: req.username,
    profile_image_url: updated.profile_image_url || defaultProfileImageUrl,
    short_bio: updated.short_bio || defaultShortBio,
  } });
};

module.exports = {
  getJobs,
  getJobById,
  saveJob,
  applyToJob,
  removeSavedJob,
  removeAppliedJob,
  getSavedJobs,
  getAppliedJobs,
  getProfile,
  updateProfile,
};