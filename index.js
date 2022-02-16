const express = require('express');
const app = express(); // instance of express
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
  // on data event
  req.on('data', (data) => {
    // data retrieved in a buffer must be converted from utf8 and split
    const parsed = data.toString('utf8').split('&');
    const formData = {};
    for (let pair of parsed) {
      const [key, value] = pair.split('=');
      formData[key] = value;
    }

    log(formData);
  });

  res.send('Account created!');
});

app.listen(3000, () => {
  console.log('Listening on 3000');
});
