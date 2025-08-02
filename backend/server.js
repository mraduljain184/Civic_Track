require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('./Routes/AuthRouter');
const issueRouter = require('./Routes/IssueRouter');
const app = express();
require('./Models/db'); // Ensure the database connection is established

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;



app.use('/auth', authRouter);
app.use('/issues', issueRouter);



app.get('/', (req, res) => {
  res.send('Welcome to the Civic Track API!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});