const { con } = require('./sql');
const express = require('express');
const appRouter = express.Router();



appRouter.get('/sortPosts',(req, res) => {

    if (Object.keys(req.query.filters).length === 0) {
      let queryAllPosts = '';

      switch(req.query.sortMethod) {
        case "recommendedPosts":
            queryAllPosts = 'SELECT * FROM posts ORDER BY title ASC';
            break;
        case "hotPosts":
            queryAllPosts = 'SELECT * FROM posts WHERE creationDate >= NOW() - INTERVAL 1 DAY ORDER BY voteCount DESC';
            break;
        case "newPosts":
            queryAllPosts = 'SELECT * FROM posts ORDER BY creationDate DESC';
            break;
        case "oldPosts":
            queryAllPosts = 'SELECT * FROM posts ORDER BY creationDate ASC';
            break;
        case "topPosts":
            queryAllPosts = 'SELECT * FROM posts ORDER BY voteCount DESC';
            break;
        case "bottomPosts":
            queryAllPosts = 'SELECT * FROM posts ORDER BY voteCount ASC';
            break;
        default:
            queryAllPosts = 'SELECT * FROM posts ORDER BY title DESC';
      }

      con.query(queryAllPosts, (error, resultPosts) => {
        if (error) {
          console.log('[Error]: appRouter.route.(/posts).get -> con.query(queryAllPosts)');
          console.log(err);
        }
        else {
          res.send({code: 200, posts: resultPosts});
        }
      });
    }
    else {
      let strFilters = '';
      let sizeFilters = 0;
  
      Object.keys(req.query.filters).forEach(function(key) {
        strFilters += `'${req.query.filters[key]}',`;
        sizeFilters += 1;
      });
      strFilters = strFilters.slice(0, -1);

      let queryFilters = 
        `SELECT * FROM posts WHERE id IN (
        SELECT postID FROM tagpostid WHERE tagID IN (
        SELECT id FROM tags WHERE title IN (${strFilters}))
        GROUP BY postID HAVING COUNT(DISTINCT tagID) = ${sizeFilters})`;


      switch(req.query.sortMethod) {
        case "recommendedPosts":
            queryFilters += ' ORDER BY title ASC';
            break;
        case "hotPosts":
            queryFilters += ' AND creationDate >= NOW() - INTERVAL 1 DAY ORDER BY voteCount DESC';
            break;
        case "newPosts":
            queryFilters += ' ORDER BY creationDate DESC';
            break;
        case "oldPosts":
            queryFilters += ' ORDER BY creationDate ASC';
            break;
        case "topPosts":
            queryFilters += ' ORDER BY voteCount DESC';
            break;
        case "bottomPosts":
            queryFilters += ' ORDER BY voteCount ASC';
            break;
        default:
            queryFilters += ' ORDER BY title DESC';
      }

      con.query(queryFilters, (error, resultPosts) => {
        if (error) {
          console.log('[Error]: appRouter.route.(/posts).post -> con.query(queryFilters)');
          console.log(error);
        }
        else {
          res.send({code: 200, posts: resultPosts});
        }
      });
    }
  })


  appRouter.get('/getFilters',(req, res) => {

    const queryAllTags = 'SELECT * FROM tags ORDER BY title ASC';

    con.query(queryAllTags, (error, resultTags) => {
        if (error) {
          console.log('[Error]: appRouter.route.(/posts).get -> con.query(queryAllTags)');
          console.log(err);
        }
        else {
          res.send({code: 200, tags: resultTags});
        }
      });
  })









  appRouter.get('/filteredPosts',(req, res) => {

    if (Object.keys(req.query).length === 0) {
      const queryAllPosts = 'SELECT * FROM posts ORDER BY creationDate DESC';
      con.query(queryAllPosts, (error, resultPosts) => {
        if (error) {
          console.log('[Error]: appRouter.route.(/posts).post -> con.query(queryFilters)');
          console.log(error);
        }
        else {
          res.send({code: 200, posts: resultPosts});
        }
      });
    }
    else {
      let strFilters = '';
      let sizeFilters = 0;
  
      Object.keys(req.query).forEach(function(key) {
        strFilters += `'${req.query[key]}',`;
        sizeFilters += 1;
      });
      strFilters = strFilters.slice(0, -1);
  
      const queryFilters = 
        `SELECT * FROM posts WHERE id IN (
        SELECT postID FROM tagpostid WHERE tagID IN (
        SELECT id FROM tags WHERE title IN (${strFilters}))
        GROUP BY postID HAVING COUNT(DISTINCT tagID) = ${sizeFilters}) 
        ORDER BY creationDate DESC;`;
  
        con.query(queryFilters, (error, resultPosts) => {
          if (error) {
            console.log('[Error]: appRouter.route.(/posts).post -> con.query(queryFilters)');
            console.log(error);
          }
          else {
            res.send({code: 200, posts: resultPosts});
          }
        });
    }
  });

module.exports = appRouter;