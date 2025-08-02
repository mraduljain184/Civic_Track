const mongoose = require('mongoose');
const mongo_url = process.env.MONGODB_URI 

mongoose.connect(mongo_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
}); 