const mongoose = require('mongoose');
const Job = require('./models/Job');
require('dotenv').config();

const dummyJobs = [
  {
    title: 'Full Stack Developer',
    company_logo_url:
      '/assets/facebook-img.png',
    company_website_url: 'https://about.facebook.com/',
    employment_type: 'FULLTIME',
    job_description: 'Build the next generation of social networking tools.',
    location: 'Bangalore',
    package_per_annum: 1500000,
    rating: 4.5,
    skills: [
      {
        name: 'React',
        image_url: '/assets/react-img.png',
      },
      {
        name: 'Node.js',
        image_url: '/assets/react-img.png',
      },
    ],
    life_at_company: {
      description: 'People-first culture with a strong focus on collaboration.',
      image_url: '/assets/home-lg-bg.png',
    },
  },
  {
    title: 'Backend Engineer',
    company_logo_url:
      '/assets/netflix-img.png',
    company_website_url: 'https://about.netflix.com/',
    employment_type: 'PARTTIME',
    job_description:
      'Help optimize video streaming protocols for millions of users.',
    location: 'Hyderabad',
    package_per_annum: 1200000,
    rating: 4.2,
    skills: [
      {
        name: 'Express',
        image_url: '/assets/react-img.png',
      },
      {
        name: 'MongoDB',
        image_url: '/assets/mongo-db-img.png',
      },
    ],
    life_at_company: {
      description: 'Focus on scalable systems and async problem solving.',
      image_url: '/assets/home-lg-bg.png',
    },
  },
  {
    title: 'Frontend Developer',
    company_logo_url:
      '/assets/google-img.png',
    company_website_url: 'https://about.google/',
    employment_type: 'FREELANCE',
    job_description:
      'Collaborate with designers to build beautiful search interfaces.',
    location: 'Delhi',
    package_per_annum: 2000000,
    rating: 4.8,
    skills: [
      {
        name: 'React',
        image_url: '/assets/react-img.png',
      },
      {
        name: 'CSS',
        image_url: '/assets/css-img.png',
      },
    ],
    life_at_company: {
      description: 'A design-led environment with strong product thinking.',
      image_url: '/assets/home-lg-bg.png',
    },
  },
  {
    title: 'Mobile App Intern',
    company_logo_url:
      '/assets/amazon-img.png',
    company_website_url: 'https://www.aboutamazon.com/',
    employment_type: 'INTERNSHIP',
    job_description: 'Support feature development for consumer mobile apps.',
    location: 'Chennai',
    package_per_annum: 600000,
    rating: 4.1,
    skills: [
      {
        name: 'React Native',
        image_url: '/assets/react-img.png',
      },
      {
        name: 'Testing',
        image_url: '/assets/node-js-img.png',
      },
    ],
    life_at_company: {
      description: 'A fast-moving team with plenty of mentorship.',
      image_url: '/assets/home-lg-bg.png',
    },
  },
  {
    title: 'Senior React Engineer',
    company_logo_url:
      '/assets/facebook-img.png',
    company_website_url: 'https://about.x.com/',
    employment_type: 'FULLTIME',
    job_description: 'Lead frontend architecture and mentor junior engineers.',
    location: 'Pune',
    package_per_annum: 2800000,
    rating: 4.7,
    skills: [
      {
        name: 'React',
        image_url: '/assets/react-img.png',
      },
      {
        name: 'TypeScript',
        image_url: '/assets/typescript-img.png',
      },
    ],
    life_at_company: {
      description: 'High ownership, strong code review, and product velocity.',
      image_url: '/assets/home-lg-bg.png',
    },
  },{
    title: 'React Native Developer',
    company_logo_url: '/assets/amazon-img.png',
    company_website_url: 'https://www.aboutamazon.com/',
    employment_type: 'FULLTIME',
    job_description: 'Build cross-platform mobile applications for millions of users.',
    location: 'Remote',
    package_per_annum: 1800000,
    rating: 4.4,
    skills: [{ name: 'React Native', image_url: '/assets/react-img.png' }],
    life_at_company: {
      description: 'Work from anywhere with great benefits.',
      image_url: '/assets/home-lg-bg.png',
    },
  },
  {
    title: 'Junior Backend Developer',
    company_logo_url: '/assets/netflix-img.png',
    company_website_url: 'https://about.netflix.com/',
    employment_type: 'PARTTIME',
    job_description: 'Assist in building scalable microservices and APIs.',
    location: 'Hyderabad',
    package_per_annum: 800000,
    rating: 4.0,
    skills: [{ name: 'Node.js', image_url: '/assets/node-js-img.png' }],
    life_at_company: {
      description: 'Learn from senior engineers in a fast-paced environment.',
      image_url: '/assets/home-lg-bg.png',
    },
  },
  {
    title: 'UI/UX Designer',
    company_logo_url: '/assets/google-img.png',
    company_website_url: 'https://about.google/',
    employment_type: 'FREELANCE',
    job_description: 'Design beautiful, accessible interfaces for our core products.',
    location: 'Delhi',
    package_per_annum: 1500000,
    rating: 4.9,
    skills: [{ name: 'Figma', image_url: '/assets/css-img.png' }],
    life_at_company: {
      description: 'A design-led environment with strong product thinking.',
      image_url: '/assets/home-lg-bg.png',
    },
  },
  {
    title: 'Senior MERN Stack Engineer',
    company_logo_url: '/assets/amazon-img.png',
    company_website_url: 'https://www.aboutamazon.com/',
    employment_type: 'FULLTIME',
    job_description: 'Architect scalable web applications and lead our frontend transition to React and TanStack Query.',
    location: 'Bangalore',
    package_per_annum: 2400000,
    rating: 4.8,
    skills: [
      {
        name: 'React',
        image_url: '/assets/react-img.png',
      },
      {
        name: 'Node.js',
        image_url: '/assets/node-js-img.png',
      },
      {
        name: 'MongoDB',
        image_url: '/assets/mongo-db-img.png',
      }
    ],
    life_at_company: {
      description: 'We believe in high ownership, continuous learning, and providing the best tools for our engineers.',
      image_url: '/assets/life-at-company-img.png',
    },
  },
  {
    title: 'Data Scientist',
    company_logo_url: '/assets/google-img.png',
    company_website_url: 'https://about.google/',
    employment_type: 'FULLTIME',
    job_description: 'Analyze large datasets to extract actionable insights and build predictive machine learning models.',
    location: 'Bangalore',
    package_per_annum: 2200000,
    rating: 4.6,
    skills: [
      { name: 'Python', image_url: '/assets/node-js-img.png' },
      { name: 'Machine Learning', image_url: '/assets/react-img.png' },
    ],
    life_at_company: {
      description: 'Work alongside world-class researchers solving complex problems at scale.',
      image_url: '/assets/home-lg-bg.png',
    },
  },
  {
    title: 'DevOps Engineer',
    company_logo_url: '/assets/amazon-img.png',
    company_website_url: 'https://www.aboutamazon.com/',
    employment_type: 'FULLTIME',
    job_description: 'Design and maintain CI/CD pipelines, ensuring maximum uptime and scalable cloud infrastructure.',
    location: 'Hyderabad',
    package_per_annum: 1800000,
    rating: 4.3,
    skills: [
      { name: 'AWS', image_url: '/assets/typescript-img.png' },
      { name: 'Docker', image_url: '/assets/react-img.png' },
    ],
    life_at_company: {
      description: 'A fast-paced environment focusing on automation and operational excellence.',
      image_url: '/assets/life-at-company-img.png',
    },
  },
  {
    title: 'Freelance UI/UX Designer',
    company_logo_url: '/assets/netflix-img.png',
    company_website_url: 'https://about.netflix.com/',
    employment_type: 'FREELANCE',
    job_description: 'Create high-fidelity wireframes and interactive prototypes for upcoming streaming features.',
    location: 'Remote',
    package_per_annum: 1200000,
    rating: 4.8,
    skills: [
      { name: 'Figma', image_url: '/assets/css-img.png' },
      { name: 'UI Design', image_url: '/assets/react-img.png' },
    ],
    life_at_company: {
      description: 'High autonomy and creative freedom to design interfaces used by millions.',
      image_url: '/assets/home-lg-bg.png',
    },
  },
  {
    title: 'Frontend React Intern',
    company_logo_url: '/assets/facebook-img.png',
    company_website_url: 'https://about.meta.com/',
    employment_type: 'INTERNSHIP',
    job_description: 'Assist the core frontend team in migrating legacy components to modern React Hooks.',
    location: 'Pune',
    package_per_annum: 400000,
    rating: 4.1,
    skills: [
      { name: 'React', image_url: '/assets/react-img.png' },
      { name: 'CSS', image_url: '/assets/css-img.png' },
    ],
    life_at_company: {
      description: 'An excellent learning environment with direct mentorship from senior engineers.',
      image_url: '/assets/life-at-company-img.png',
    },
  },
  {
    title: 'Part-time QA Tester',
    company_logo_url: '/assets/google-img.png',
    company_website_url: 'https://about.google/',
    employment_type: 'PARTTIME',
    job_description: 'Write and execute manual and automated test cases to ensure cross-browser compatibility.',
    location: 'Delhi',
    package_per_annum: 600000,
    rating: 4.0,
    skills: [
      { name: 'Selenium', image_url: '/assets/react-img.png' },
      { name: 'Testing', image_url: '/assets/typescript-img.png' },
    ],
    life_at_company: {
      description: 'Flexible working hours with a focus on delivering bug-free user experiences.',
      image_url: '/assets/home-lg-bg.png',
    },
  },
  {
    title: 'Cloud Solutions Architect',
    company_logo_url: '/assets/amazon-img.png',
    company_website_url: 'https://www.aboutamazon.com/',
    employment_type: 'FULLTIME',
    job_description: 'Lead the architectural design of enterprise cloud solutions for major global clients.',
    location: 'Bangalore',
    package_per_annum: 3500000,
    rating: 4.9,
    skills: [
      { name: 'System Design', image_url: '/assets/mongo-db-img.png' },
      { name: 'AWS', image_url: '/assets/react-img.png' },
    ],
    life_at_company: {
      description: 'Take extreme ownership of massive-scale distributed systems.',
      image_url: '/assets/life-at-company-img.png',
    },
  },
  {
    title: 'MERN Stack Intern',
    company_logo_url: '/assets/netflix-img.png',
    company_website_url: 'https://about.netflix.com/',
    employment_type: 'INTERNSHIP',
    job_description: 'Work with the internal tools team to build REST APIs and intuitive dashboards.',
    location: 'Remote',
    package_per_annum: 500000,
    rating: 4.4,
    skills: [
      { name: 'MongoDB', image_url: '/assets/mongo-db-img.png' },
      { name: 'Node.js', image_url: '/assets/node-js-img.png' },
    ],
    life_at_company: {
      description: 'Culture of freedom and responsibility with opportunities to push code to production.',
      image_url: '/assets/home-lg-bg.png',
    },
  },
  {
    title: 'Senior Node.js Developer',
    company_logo_url: '/assets/facebook-img.png',
    company_website_url: 'https://about.meta.com/',
    employment_type: 'FULLTIME',
    job_description: 'Optimize high-traffic backend services and implement advanced caching layers.',
    location: 'Hyderabad',
    package_per_annum: 2600000,
    rating: 4.5,
    skills: [
      { name: 'Node.js', image_url: '/assets/node-js-img.png' },
      { name: 'Redis', image_url: '/assets/mongo-db-img.png' },
    ],
    life_at_company: {
      description: 'Move fast and build impactful infrastructure used by billions of people.',
      image_url: '/assets/life-at-company-img.png',
    },
  },
  {
    title: 'Freelance Technical Writer',
    company_logo_url: '/assets/amazon-img.png',
    company_website_url: 'https://www.aboutamazon.com/',
    employment_type: 'FREELANCE',
    job_description: 'Author detailed API documentation and developer guides for open-source tools.',
    location: 'Remote',
    package_per_annum: 800000,
    rating: 4.7,
    skills: [
      { name: 'Markdown', image_url: '/assets/css-img.png' },
      { name: 'Documentation', image_url: '/assets/typescript-img.png' },
    ],
    life_at_company: {
      description: 'Work independently while ensuring developer success through clear communication.',
      image_url: '/assets/home-lg-bg.png',
    },
  },
  {
    title: 'Database Administrator',
    company_logo_url: '/assets/google-img.png',
    company_website_url: 'https://about.google/',
    employment_type: 'FULLTIME',
    job_description: 'Manage, scale, and secure large MongoDB clusters to ensure zero data loss.',
    location: 'Chennai',
    package_per_annum: 1600000,
    rating: 4.2,
    skills: [
      { name: 'MongoDB', image_url: '/assets/mongo-db-img.png' },
      { name: 'SQL', image_url: '/assets/node-js-img.png' },
    ],
    life_at_company: {
      description: 'Maintain the backbone of our data infrastructure in a highly secure environment.',
      image_url: '/assets/life-at-company-img.png',
    },
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Job.deleteMany({});
    await Job.insertMany(dummyJobs);
    console.log('Database seeded successfully.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
