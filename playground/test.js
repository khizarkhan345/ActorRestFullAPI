const { auth } = require('express-openid-connect');
const express = require('express');
const app = express();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: 'DmwMeGcpEIBFEWOpMlAkGw9jeT2lmsCV',
  issuerBaseURL: 'https://dev-4h1xk-tf.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});