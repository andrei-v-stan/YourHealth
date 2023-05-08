const { con } = require('./sql');
const express = require('express');
const appRouter = express.Router();

const path = require('path');


appRouter.route('/testing')
  .get((req, res) => {
    const queryAllPosts = 'SELECT * FROM posts ORDER BY creationDate DESC';
    const queryAllTags = 'SELECT * FROM tags ORDER BY title ASC';

    con.query(queryAllPosts, (error, resultPosts) => {
      if (error) {
        console.log('[Error]: appRouter.route.(/posts).get -> con.query(queryAllPosts)');
        console.log(err);
      }
      else {
        con.query(queryAllTags, (error, resultTags) => {
          if (error) {
            console.log('[Error]: appRouter.route.(/posts).get -> con.query(queryAllTags)');
            console.log(err);
          }
          else {
            res.render('posts', { posts: resultPosts, tags: resultTags });
          }
        });
      }
    });
  })

  .post((req, res) => {
    const queryAllPosts = 'SELECT * FROM posts ORDER BY creationDate DESC';
    const queryAllTags = 'SELECT * FROM tags ORDER BY title ASC';
    let strFilters = '';
    var i;
  
    if (req.body && req.body.filters) {
      if(typeof(req.body.filters) == 'string')  {
        strFilters = `'` + req.body.filters + `'`;
        i = 1;
      }
      else {
        let reqFilters;
        reqFilters = Array.from(new Set(req.body.filters));
        reqFilters = Object.entries(reqFilters).map(([key, value]) => `${value}`);
        for (i=0; i<reqFilters.length; i++) {
          strFilters = strFilters + `'` + reqFilters[i] + `',`
        }
        strFilters = strFilters.slice(0, -1);
      }

      console.log(req.body.filters,'\n',strFilters,'\n',i);

      const queryFilters = `SELECT * FROM posts WHERE id IN (
          SELECT postID FROM tagpostid WHERE tagID IN (
          SELECT id FROM tags WHERE title IN (${strFilters}))
          GROUP BY postID HAVING COUNT(DISTINCT tagID) = ${i}) 
      ORDER BY creationDate DESC;`

      con.query(queryFilters, (error, resultPosts) => {
        if (error) {
          console.log('[Error]: appRouter.route.(/posts).post -> con.query(queryFilters)');
          console.log(err);
        }
        else {
          con.query(queryAllTags, (error, resultTags) => {
            if (error) {
              console.log('[Error]: appRouter.route.(/posts).post -> con.query(queryAllTags)');
              console.log(err);
            }
            else {
              res.render('posts', { posts: resultPosts, tags: resultTags });
            }
          });
        }
      });
    }
    else {  
      con.query(queryAllPosts, (error, resultPosts) => {
        if (error) {
          console.log('[Error]: appRouter.route.(/posts).post -> con.query(queryAllPosts)');
          console.log(err);
        }
        else {
          con.query(queryAllTags, (error, resultTags) => {
            if (error) {
              console.log('[Error]: appRouter.route.(/posts).post -> con.query(queryAllTags)');
              console.log(err);
            }
            else {
              res.render('posts', { posts: resultPosts, tags: resultTags });
            }
          });
        }
      });
    }
  });




  appRouter.get('/posts/:id', (req, res) => {
    const postID = req.params.id;

    if (/[^0-9]/.test(postID) || /^0/.test(postID) || req.url.length > `/posts/${postID}`.length) {
      res.render('statusHandler', { statusMessage: 'This post does not exist' });
    }
    else {
      con.query('SELECT * FROM posts WHERE id=?', postID, (error, result) => {
        if (error) {
          console.log('[Error]: appRouter.post(/posts/:id) -> con.query(SELECT * FROM posts WHERE id=?)');
          console.error(error);
          res.send({code: 500});
        }
        if (Object.keys(result).length == 0) {
            res.render('statusHandler', { statusMessage: 'This post does not exist' });
        }
        else {
          res.sendFile(path.join(__dirname, '../html', 'postDetails.html'));
        }
      });
    }
  });



  appRouter.get('/getPostDetails', (req, res) => {
    const postID = req.query.postID;

    con.query('SELECT * FROM posts WHERE id=?', postID, (error, resPostDetails) => {
      if (error) {
        console.log('[Error]: appRouter.post(/getPostDetails) -> con.query(SELECT * FROM posts WHERE id=?)');
        console.error(error);
        res.send({code: 500});
      }
      if (Object.keys(resPostDetails).length == 0) {
          res.render('statusHandler', { statusMessage: 'This post does not exist' });
      }
      else {
        con.query('SELECT * FROM comments WHERE postID=?', postID, (error, resComments) => {
          if (error) {
            console.log('[Error]: appRouter.post(/getPostDetails) -> con.query(SELECT * FROM posts WHERE id=?)');
            console.error(error);
            res.send({code: 500});
          }

          else {
            res.send({code: 200, post: resPostDetails[0], comments: resComments});
          }
        });
      }
    });
  });



  appRouter.get('/submitComment', (req, res) => {
    const { postID, parentID, parentType, authorID, content } = req.query;
    const queryPostComment = `INSERT INTO comments (postID, parentID, parentType, authorID, content) VALUES (?, ?, ?, ?, ?)`;

    con.query(queryPostComment, [postID, parentID, parentType, authorID, content, '0'], (error, result) => {
      if (error) {
        console.log('[Error]: appRouter.post(/submitComment) -> con.query(queryPostComment)');
        console.error(error);
        res.send({code: 500});
      }
      else {
        res.send({code: 200});
      }
    });
  });














appRouter.route('/users/:id')
  .get((req, res) => {
    const userID = parseInt(req.params.id);

    if (userID == req.params.id && req.params.id[0] != '0') {
      con.query('SELECT MAX(id) FROM usercreds', (error, result) => {
        if (error) {
          console.log('[Error]: appRouter.get(/users/:id) -> con.query(SELECT MAX(id) FROM usercreds)');
          console.log(err);
        }
        else {
          const userMax = result[0]['MAX(id)'];
          if (0 < userID && userID <= userMax) {
            con.query('SELECT * FROM posts WHERE authorID=? ORDER BY creationDate DESC', [userID], (err, resultPosts) => {
              if (error) {
                console.log('[Error]: appRouter.get(/users/:id) -> con.query(SELECT * FROM posts WHERE authorID=? ORDER BY creationDate DESC)');
                console.log(err);
              }
              else {
                con.query('SELECT * FROM tags ORDER BY title ASC', (error, resultTags) => {
                  if (error) {
                    console.log('[Error]: appRouter.get(/users/:id) -> con.query(SELECT * FROM tags ORDER BY title ASC)');
                    console.log(err);
                  }
          
                  res.render('user', { posts: resultPosts, tags: resultTags, userID });
                });
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
      res.status(401).send(res.render('statusHandler', { statusMessage: 'The user does not exist' }));
    }
  })

  .post((req, res) => {
    const queryAllPostsByUser = 'SELECT * FROM posts WHERE authorID=? ORDER BY creationDate DESC';
    const queryAllTags = 'SELECT * FROM tags ORDER BY title ASC';
    const userID = parseInt(req.params.id);
    let strFilters = '';
    var i;
  
    if (req.body && req.body.filters) {
      if(typeof(req.body.filters) == 'string')  {
        strFilters = `'` + req.body.filters + `'`;
        i = 1;
      }
      else {
        let reqFilters;
        reqFilters = Array.from(new Set(req.body.filters));
        reqFilters = Object.entries(reqFilters).map(([key, value]) => `${value}`);
        for (i=0; i<reqFilters.length; i++) {
          strFilters = strFilters + `'` + reqFilters[i] + `',`
        }
        strFilters = strFilters.slice(0, -1);
      }

      const queryFilters = `SELECT * FROM posts WHERE (id IN (
        SELECT postID FROM tagpostid WHERE tagID IN (
        SELECT id FROM tags WHERE title IN (${strFilters}))
        GROUP BY postID HAVING COUNT(DISTINCT tagID) = ${i}) 
        AND authorID=${userID})
      ORDER BY creationDate DESC;`

      con.query(queryFilters, (error, resultPosts) => {
        if (error) {
          console.log('[Error]: appRouter.route.(/users/:id).post -> con.query(queryFilters)');
          console.log(err);
        }
        else {
          con.query(queryAllTags, (error, resultTags) => {
            if (error) {
              console.log('[Error]: appRouter.route.(/users/:id).post -> con.query(queryAllTags)');
              console.log(err);
            }
            else {
              res.render('user', { posts: resultPosts, tags: resultTags, userID });
            }
          });
        }
      });
    }
    else {  
      con.query(queryAllPostsByUser, [userID], (error, resultPosts) => {
        if (error) {
          console.log('[Error]: appRouter.route.(/users/:id).post -> con.query(queryAllPostsByUser)');
          console.log(err);
        }
        else {
          con.query(queryAllTags, (error, resultTags) => {
            if (error) {
              console.log('[Error]: appRouter.route.(/users/:id).post -> con.query(queryAllTags)');
              console.log(err);
            }
            else {
              res.render('user', { posts: resultPosts, tags: resultTags, userID });
            }
          });
        }
      });
    }
  });




  module.exports = appRouter;