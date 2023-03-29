const { con } = require('./sql');
const express = require('express');
const appRouter = express.Router();


appRouter.get('/cookies', (req, res) => {
    res.send(Object.entries(req.cookies));
  });  



appRouter.route('/pots')
  .get((req, res) => {
    var reqFilters;
    if(!req.body.filters){
      reqFilters = req.body.filters;
    }
    else{
      res.render('posts', { posts: 0 });
    }
  })
  .post((req, res) => {
    var reqFilters;
    if(!req.body.filters){
      reqFilters = req.body.filters;
    }
    else{
      res.render('posts', { posts: 0 });
    }
  });

appRouter.get('/test', (req, res) => {
    console.log(req.body);
    res.render('posts', { posts: 0 });
});

appRouter.get('/tests', (req, res) => {

});

module.exports = appRouter;