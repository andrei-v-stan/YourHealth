const { con } = require('./sql');
const express = require('express');
const appRouter = express.Router();


appRouter.get('/cookies', (req, res) => {
    res.send(Object.entries(req.cookies));
  });  



appRouter.route('/pots')
  .get((req, res) => {
    var reqFilters;
    console.log(req.body.filters);
    if (!req.body) {
      if(!req.body.filters){
        reqFilters = req.body.filters;
      }
      else{
        res.render('posts', { posts: 0 });
      }
    }
    else{
      con.query('SELECT * FROM posts', (error, result, fields) => {
        if (error) throw error;
    
        res.render('posts', { posts: result });
        console.log('x');
      });
    }
  })

  .post((req, res) => {
    var reqFilters;
    console.log(req.body.filters);
    if (!req.body) {
      if(!req.body.filters){
        reqFilters = req.body.filters;
      }
      else{
        res.render('posts', { posts: 0 });
      }
    }
    else{
      res.render('posts', { posts: 0 });
      console.log('render filters');
    }
  });

appRouter.get('/test', (req, res) => {
    console.log(req.body);
    res.render('posts', { posts: 0 });
});

module.exports = appRouter;