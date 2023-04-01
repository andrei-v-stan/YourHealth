const { con } = require('./sql');
const express = require('express');
const appRouter = express.Router();


appRouter.get('/cookies', (req, res) => {
    res.send(Object.entries(req.cookies));
  }); 


appRouter.get('/test', (req, res) => {
    console.log(req.body);
    res.render('posts', { posts: 0 });
});

module.exports = appRouter;