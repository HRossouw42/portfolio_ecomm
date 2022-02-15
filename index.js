const express = require('express');
const app = express(); // instance of express

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => {
  console.log('Listening on 3000');
});