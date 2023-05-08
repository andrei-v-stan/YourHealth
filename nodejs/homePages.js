const { con } = require('./sql');
const express = require('express');
const appRouter = express.Router();



appRouter.get('/sortPosts',(req, res) => {

    if (req.query.filters === undefined || req.query.filters === null || Object.keys(req.query.filters).length === 0) {
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

  
  appRouter.get('/getVotes',(req, res) => {
    const queryLikedPosts = `SELECT postID FROM postlikes WHERE userID = ${req.cookies.accountID} AND vote = 1`;
    const queryDislikedPosts = `SELECT postID FROM postlikes WHERE userID = ${req.cookies.accountID} AND vote = -1`;

    con.query(queryLikedPosts, (error, resLikes) => {
        if (error) {
          console.log('[Error]: appRouter.route.(/posts).get -> con.query(queryAllTags)');
          console.log(error);
        }
        con.query(queryDislikedPosts, (error, resDislikes) => {
          if (error) {
            console.log('[Error]: appRouter.route.(/posts).get -> con.query(queryAllTags)');
            console.log(error);
          }
          res.send({code: 200, likedPostsIDs: resLikes.map(item => item.postID), dislikedPostsIDs: resDislikes.map(item => item.postID)});
        });
      });
  })




  appRouter.get('/posts/:id', (req, res) => {
    const postID = parseInt(req.params.id);
  
    if (postID == req.params.id && req.params.id[0] != '0') {
      con.query('SELECT MAX(id) FROM posts', (error, result) => {
        if (error) {
          console.log('[Error]: appRouter.get(/posts/:id) -> con.query(SELECT MAX(id) FROM posts)');
          console.log(err);
        }
        else {
          const postMax = result[0]['MAX(id)'];
          if (0 < postID && postID <= postMax) {
            con.query('SELECT * FROM posts WHERE id = ?', [postID], (err, result) => {
              if (error) {
                console.log('[Error]: appRouter.get(/posts/:id) -> con.query(SELECT * FROM posts WHERE id = ?)');
                console.log(err);
              }
              else {
                const post = result[0];
                res.send(`
                  <html>
                    <head>
                      <title>${post.title}</title>
                    </head>
                    <body>
                      <h1>${post.authorID}</h1>
                      <p>${post.content}</p>
                    </body>
                    </html>
                  `);
              }
            });
          }
          else {
            res.status(401).send(res.render('statusHandler', { statusMessage: 'The post does not exist' }));
          }
        }   
     });
    }
    else {
      res.status(401).send(res.render('statusHandler', { statusMessage: 'The post does not exist' }));
    }
  });














module.exports = appRouter;