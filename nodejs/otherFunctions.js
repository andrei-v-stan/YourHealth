
const nodemailer = require('nodemailer');

const { con } = require('./sql');
const express = require('express');
const appRouter = express.Router();



appRouter.post('/signup', (req, res) => {
  const { username, password, email } = req.body;
  const querySignUp = `INSERT INTO usercreds (username, password, email) VALUES (?, ?, ?)`;
  const queryAccEmail = `SELECT 1 FROM usercreds WHERE email = ? LIMIT 1`;
  const queryAccUsername = `SELECT 1 FROM usercreds WHERE username = ? LIMIT 1`;

  con.query(queryAccUsername, [username], (error, result) => {
    if (error) {
      console.log('[Error]: appRouter.post(/signup) -> con.query(queryAccUsername)');
      console.error(error);
      res.status(500).send(res.render('statusHandler', { statusMessage: 'There has been an internal server error' }));
    }
    if (result == 0) {
      con.query(queryAccEmail, [email], (error, result) => {
        if (error) {
          console.log('[Error]: appRouter.post(/signup) -> con.query(queryAccEmail)');
          console.error(error);
          res.status(500).send(res.render('statusHandler', { statusMessage: 'There has been an internal server error' }));
        }
        if (result == 0) {
          con.query(querySignUp, [username, password, email], (error, result) => {
            if (error) {
              console.log('[Error]: appRouter.post(/signup) -> con.query(querySignUp)');
              console.error(error);
              res.status(500).send(res.render('statusHandler', { statusMessage: 'There has been an internal server error' }));
            }
            else {
              res.status(200).send(res.render('statusHandler', { statusMessage: 'Account created successfully' }));
            }
          });
        }
        else {
          res.status(500).send(res.render('statusHandler', { statusMessage: 'The email address is already in use' }));
        }
      });
    }
    else {
      res.status(500).send(res.render('statusHandler', { statusMessage: 'The username is already in use' }));
    }
  });
});


appRouter.post('/login', (req, res) => {
  const { emailLogin, passwordLogin } = req.body;
  con.query('SELECT * FROM usercreds WHERE ((email = ? AND password = ?) OR (username = ? AND password = ?))',
  [emailLogin, passwordLogin,emailLogin, passwordLogin], (err, result) => {
      if (err) {
          console.log('[Error]: appRouter.post(/login) -> con.query(...)');
          console.error(err);
          res.status(500).send(res.render('statusHandler', { statusMessage: 'There has been an internal server error' }));
      } else if (result.length == 0) {
          res.status(401).send(res.render('statusHandler', { statusMessage: 'Invalid email or password' }));
      } else {
          res.cookie('accountID', result[0].id);
          res.status(200).send(res.render('statusHandler', { statusMessage: 'Logged in successfully' }));
      }
  });
});


appRouter.post('/logout', (req, res) => {
  const cookies = Object.keys(req.cookies);
  cookies.forEach(cookieName => {
    res.clearCookie(cookieName);
  });
  res.status(200).send(res.render('statusHandler', { statusMessage: 'Logged out successfully' }));
});




appRouter.post('/mail', (req, res) => {
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yourmindfii@gmail.com',
        pass: 'mfqpnxgrnbecdzhl'
    }
});

const { nameMail, emailMail, textMail } = req.body;

let mailDetails = {
    from: 'yourmindfii@gmail.com',
    to: 'yourmindfii@gmail.com',
    subject: `${nameMail} form contact`,
    html: `<p>From: ${emailMail} <br> Message: ${textMail}</p>`
};

mailTransport.sendMail(mailDetails, (err, result) => {
    if (err) {
      console.log('[Error]: appRouter.post(/mail) -> mailTransport.sendmail()');
      console.log(err);
      res.status(500).send(res.render('statusHandler', { statusMessage: 'There has been an internal server error' }));
    } else {
      res.status(200).send(res.render('statusHandler', { statusMessage: 'Email sent successfully' }));
    }
  });
});


appRouter.post('/location', (req, res) => {
  const { lat, long, acc } = req.body;
  let queryLocation;
  let accID;

  if(!req.cookies.accountID)  {
    accID = 1;
  }
  else {
    accID = req.cookies.accountID;
  }

  querySql = `INSERT INTO userlocs (accountID, latitude, longitude, accuracy, recordingStamp) VALUES ('${accID}', ${lat}, ${long}, ${acc}, NOW())`;
  con.query(queryLocation, (error, result) => {
    if (error) {
      console.log('[Error]: appRouter.post(/location) -> con.query(queryLocation)');
      console.log(err);
    }
  });
});


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