const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Review = require('./models/Review');
  const reviews = await Review.find();
  console.log('Found reviews:', reviews.length);
  if (reviews.length > 0) console.log(reviews[0].content);
  process.exit(0);
}).catch(console.error);
