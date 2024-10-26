const express = require('express');

const router = express.Router();

const userRouter = require('./userRoutes');
const tourRouter = require('./tourRoutes');

const defaultRoutes = [
  {
    path: '/users',
    route: userRouter,
  },
  {
    path: '/tours',
    route: tourRouter,
  },
];

defaultRoutes.forEach(({ route, path }) => {
  router.use(path, route);
});

module.exports = router;