const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FAQ = require('./models/FAQ');

dotenv.config();

const faqs = [
  {
    question: "What is RankFox?",
    answer: "RankFox is an AI-first SEO platform designed to help brands monitor and optimize their visibility across generative search engines like ChatGPT, Gemini, and Perplexity.",
    order: 1
  },
  {
    question: "How does GEO work?",
    answer: "Generative Engine Optimization (GEO) involves analyzing how AI models cite and describe your brand, then optimizing your digital footprint to ensure accurate and prominent mentions.",
    order: 2
  },
  {
    question: "Which platforms do you monitor?",
    answer: "We currently monitor ChatGPT, Google Gemini, Perplexity, and Google's AI Overviews, with more being added as they launch.",
    order: 3
  }
];

const seedFAQs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await FAQ.deleteMany();
    await FAQ.insertMany(faqs);
    console.log('FAQs seeded successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedFAQs();
