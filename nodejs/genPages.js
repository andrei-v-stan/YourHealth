const { con } = require('./sql');
const express = require('express');
const appRouter = express.Router();



appRouter.route('/posts')
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