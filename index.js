const express = require('express');
const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users');
const cookieSession = require('cookie-session');
const { comparePasswords } = require('./repositories/users');

const app = express(); // instance of express
app.use(bodyParser.urlencoded({ extended: true })); // employs body parcer globally as middleware
app.use(
  cookieSession({
    keys: ['devdogdevdogdevdogdev'],
  })
);

const log = console.log.bind(console);

app.get('/signup', (req, res) => {
  res.send(`
  <div>
    Your id is: ${req.session.userId}
    <form method="POST" >
      <input name="email" placeholder="email" />
      <input name="password" placeholder="password" />
      <input name="passwordConfirmation" placeholder="password confirmation" />
      <button>Signup</button>
    </form>
  </div>
  `);
});

// Create an account
app.post('/signup', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.getOneBy({ email });
  if (existingUser) {
    return res.send('Email already in use');
  }

  if (password !== passwordConfirmation) {
    return res.send('Passwords must match');
  }

  // Create user in user repo
  const user = await usersRepo.create({ email, password });

  // Store id of user inside user cookie
  req.session.userId = user.id; // added by cookie-session library

  res.send('Account created!');
});

app.get('/signout', (req, res) => {
  // clear cookie-session
  req.session = null;
  res.send('You are logged out');
});

app.get('/signin', (req, res) => {
  res.send(`
  <div>
    <form method="POST" >
      <input name="email" placeholder="email" />
      <input name="password" placeholder="password" />
      <button>Sign In</button>
    </form>
  </div>
  `);
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return res.send('Email not found');
  }

  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );
  if (!validPassword) {
    return res.send('Invalid password');
  }

  // assign cookie
  req.session.userId = user.id;

  res.send('You are now signed in!');
});

app.listen(3000, () => {
  console.log('Listening on 3000');
});
