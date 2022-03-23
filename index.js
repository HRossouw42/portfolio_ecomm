const express = require('express');
const bodyParser = require('body-parser');

const app = express(); // instance of express
app.use(bodyParser.urlencoded({ extended: true })); // employs body parcer globally as middleware

const log = console.log.bind(console);

app.get('/', (req, res) => {
  res.send(`
  <div>
    <form method="POST" >
      <input name="email" placeholder="email" />
      <input name="password" placeholder="password" />
      <input name="passwordConfirmation" placeholder="password confirmation" />
      <button>Signup</button>
    </form>
  </div>
  `);
});

app.post('/', (req, res) => {
  log(req.body);
  res.send('Account created!');
});

app.listen(3000, () => {
  console.log('Listening on 3000');
});
