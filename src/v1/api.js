const router = require('express').Router();

const Response = require('../objects/response');
const Error = require('../objects/error');

router.get('/object', (req, res) => {
  const result = new Response.Data('data');
  res.send(result);
});

router.get('/collection', (req, res) => {
  const result = new Response.Collection(['data1', 'data2'], 0, 2);
  res.send(result);
});

router.get('/error', (req, res) => {
  const result = new Response.Error(new Error.InvalidParam());
  res.send(result);
});

module.exports = router;
