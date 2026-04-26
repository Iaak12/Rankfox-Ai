const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PageContent = require('./models/PageContent');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const initialContent = [
  {
    page: 'home',
    sections: {
      hero: {
        title: 'Automate how AI\ndiscovers, mentions, and\nmarkets your brand.',
        subtitle: 'RankFox helps brands track, understand, and optimize\ntheir visibility across AI-powered search, PR, and\naffiliate channels.',
        primaryBtn: 'Get a Demo',
        secondaryBtn: 'Free report'
      },
      features: {
        title: 'Platform Features',
        items: [
          { 
            name: 'Affylo', 
            desc: 'With advanced monitoring and analytics, Affylo tracks affiliate performance, brand mentions, and partnership opportunities across AI platforms — including ChatGPT, Gemini, Perplexity, and Google AI Overviews — while ensuring your affiliate links are properly attributed.' 
          },
          { 
            name: 'Growli', 
            desc: 'Specialized in Generative Engine Optimization (GEO), Growli continuously monitors brand mentions and citations across leading AI platforms — including ChatGPT, Gemini, Perplexity, and Google AI Overviews — while providing actionable insights to boost your visibility.' 
          },
          { 
            name: 'Pyro', 
            desc: 'Equipped with real-time monitoring capabilities, Pyro tracks how major AI platforms — including ChatGPT, Gemini, Perplexity, and Google AI Overviews — describe, and position your brand across conversational responses, allowing you to react instantly to changes in sentiment.' 
          }
        ]
      }
    }
  },
  {
    page: 'about',
    sections: {
      intro: {
        title: "We're empowering brands to\nstay visible in an AI-driven world.",
        mission: 'RankFox is on a mission to redefine how\nbrands measure visibility, because the\nnext search engine is artificial intelligence.'
      },
      story: {
        title: "Why we're building RankFox",
        text: 'As AI becomes the new search engine, brands are losing visibility in traditional SEO while conversational models increasingly shape user discovery. RankFox was built to help brands understand, monitor, and optimize how they appear across AI-generated results, ensuring they stay visible, relevant, and competitive in the age of AI-driven search.'
      }
    }
  },
  {
    page: 'pricing',
    sections: {
      header: {
        title: 'Affordable pricing for everyone',
        subtitle: 'Manage prompt libraries and optimize your flow with built-in AI tools.'
      },
      plans: [
        { name: 'Basic', price: '$299/month', target: 'FOR SMALL BUSINESSES & EARLY TEAMS' },
        { name: 'Standard', price: '$499/month', target: 'FOR GROWING D2C, SAAS, AND SERVICE BRANDS' },
        { name: 'Enterprise', price: 'CUSTOM', target: 'FOR LARGE BRANDS, MULTI-LOCATION TEAMS' }
      ]
    }
  }
];

const seedData = async () => {
  try {
    await PageContent.deleteMany();
    await PageContent.insertMany(initialContent);
    console.log('Page Content Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
