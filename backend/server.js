const express = require('express');
const bodyParser = require('body-parser');

const app = express();


const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to the Civic Track API!');
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
