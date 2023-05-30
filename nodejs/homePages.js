const { con } = require('./sql');
const express = require('express');
const appRouter = express.Router();



function getVotes(accountID) {
  return new Promise(function(resolve, reject) {
    jQuery.ajax({
      type: 'GET',
      url: `/getVotes`,
      data: accountID,
      success: function(response) {
          if (response.code == 200) {
            resolve ([response.likedPostsIDs,response.dislikedPostsIDs]);
          } 
          else if (response.code == 500) {
            reject(new Error('Internal server error'));
          } 
          else {
            reject(new Error('Unknown error occurred'));
          }
        },
      error: function() {
        console.log("[Error]: There was an error receiving the response from /changePass")
        reject('[Error]: Internal server error');
      }
    });
  });
}



appRouter.get('/getPosts',(req,res) => {
  const { inputDetails, searchingFor, sortMethod, tagFilters } = req.query;

  let queryData;
  if (searchingFor == "postTitle") {
    queryData = `WHERE LOWER(title) LIKE '%${inputDetails}%'` ;
  }
  else if (searchingFor == "postContent") {
    queryData = `WHERE LOWER(content) LIKE '%${inputDetails}%'` ;
  }

  let queryAllPosts = '';
  switch(sortMethod) {
    case "recommendedPosts":
        queryAllPosts = `SELECT * FROM posts ${queryData} ORDER BY title ASC`;
        break;
    case "hotPosts":
        queryAllPosts = `SELECT * FROM posts ${queryData} AND creationDate >= NOW() - INTERVAL 1 DAY ORDER BY voteCount DESC`;
        break;
    case "newPosts":
        queryAllPosts = `SELECT * FROM posts ${queryData} ORDER BY creationDate DESC`;
        break;
    case "oldPosts":
        queryAllPosts = `SELECT * FROM posts ${queryData} ORDER BY creationDate ASC`;
        break;
    case "topPosts":
        queryAllPosts = `SELECT * FROM posts ${queryData} ORDER BY voteCount DESC`;
        break;
    case "bottomPosts":
        queryAllPosts = `SELECT * FROM posts ${queryData} ORDER BY voteCount ASC`;
        break;
    default:
        queryAllPosts = `SELECT * FROM posts ${queryData} ORDER BY title DESC`;
  }


  if (tagFilters == undefined || tagFilters == "") {
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
    let givenTags = tagFilters.map(item => `'${item}'`).join(',')
    let queryFilters = 
    `SELECT * FROM posts WHERE id IN (
    SELECT postID FROM tagpostid WHERE tagID IN (
    SELECT id FROM tags WHERE title IN (${givenTags}))
    GROUP BY postID HAVING COUNT(DISTINCT tagID) = ${tagFilters.length})`;

    switch(sortMethod) {
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
        console.log('[Error]: appRouter.route.(/posts).get -> con.query(queryFilters)');
        console.log(error);
      }
      else {
        res.send({code: 200, posts: resultPosts});
      }
    });
  }
});



appRouter.get('/getUsers',(req,res) => {
  const inputDetails = req.query.inputDetails;

  const queryUsers = `SELECT * FROM userdetails WHERE (displayName LIKE '%${inputDetails}%' OR username LIKE '%@${inputDetails}%')`;
  con.query(queryUsers, (error, resultUsers) => {
    if (error) {
      console.log('[Error]: appRouter.route.(/posts).get -> con.query(queryUsers)');
      console.log(error);
    }
    else {
      res.send({code: 200, users: resultUsers});
    }
  });
});






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



  appRouter.get('/signupUsernameCheck', (req, res) => {
    const queryCheck = `SELECT id FROM usercreds WHERE username="${req.query.username}"`;
      con.query(queryCheck, (error, resCheck) => {
        if (error) {
          console.log('[Error]: appRouter.post(/signupUsernameCheck) -> con.query(queryCheck)');
          console.error(error);
          res.send({code: 600});
        }
        else if (resCheck.length == 0) {
          res.send({code: 01});
        }
        else {
          res.send({code: 02});
        }
      });
  });
  
  appRouter.post('/signupEmailCheck', (req, res) => {
    const queryCheck = `SELECT id FROM usercreds WHERE email="${req.body.email}"`;
      con.query(queryCheck, (error, resCheck) => {
        if (error) {
          console.log('[Error]: appRouter.post(/signupEmailCheck) -> con.query(queryCheck)');
          console.error(error);
          res.send({code: 500});
        }
        else if (resCheck.length == 0) {
          res.send({code: 200});
        }
        else {
          res.send({code: 401});
        }
      });
  });
  
  
  
  appRouter.post('/signup', (req, res) => {
    const { username, password, email } = req.body;
    const querySignUp = `INSERT INTO usercreds (username, password, email) VALUES (?, ?, ?)`;
    const queryAccId = `SELECT id FROM usercreds WHERE (username=? AND password=? AND email=?)`;
  
    con.query(querySignUp, [username, password, email], (error, result) => {
      if (error) {
        console.log('[Error]: appRouter.post(/signup) -> con.query(querySignUp)');
        console.error(error);
        res.send({code: 500});
      }
      else {
        con.query(queryAccId, [username, password, email], (error, resID) => {
          if (error) {
            console.log('[Error]: appRouter.post(/signup) -> con.query(queryAccId)');
            console.error(error);
            res.send({code: 500});
          }
          else {
            res.redirect(`/json/addGetID/${resID[0]['id']}`);
          }
        });
      }
    });
  });
  
  
  
  appRouter.post('/login', (req, res) => {
    const { username, password } = req.body;
    const queryLogin = `SELECT id FROM usercreds WHERE ((email = ? OR username = ?) AND password = ?)`;
  
    con.query(queryLogin, [username, username, password], (error, resID) => {
      if (error) {
        console.log('[Error]: appRouter.post(/login) -> con.query(queryLogin)');
        console.error(error);
        res.send({code: 500});
      }
  
      if (resID.length == 0) {
        res.send({code: 401});
      }
      else {
        res.redirect(`/json/addGetID/${resID[0]['id']}`);
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
  
  
  
  
  
  
  
  
  
  
  
  function setVotes(resLog,voteVal) {
    return new Promise((resolve, reject) => {
      let accDislikes = "";
      con.query(`SELECT postID FROM postlikes WHERE (userID=${resLog[0]['id']} AND vote=${voteVal})`, (err, resDislikes) => {
        if (err) {
          console.log('[Error]: appRouter.post(/login) -> setVotes() -> con.query(...)');
          console.error(err);
          reject(err);
        } 
        else if (resLog.length > 0) {
          for (i=0; i<resDislikes.length; i++) {
            accDislikes = accDislikes + resDislikes[i]['postID'] + "_";
          }
          accDislikes = accDislikes.slice(0, -1);
        }
        resolve(accDislikes);
      });
    });
  }
  
  
  
  appRouter.post('/login+', async (req, res) => {
    const { emailLogin, passwordLogin } = req.body;
    con.query('SELECT id FROM usercreds WHERE ((email = ? AND password = ?) OR (username = ? AND password = ?))',
    [emailLogin, passwordLogin,emailLogin, passwordLogin], async (err, resLog) => {
        if (err) {
            console.log('[Error]: appRouter.post(/login) -> con.query(...)');
            console.error(err);
            res.status(500).send(res.render('statusHandler', { statusMessage: 'There has been an internal server error' }));
        } 
        else if (resLog.length == 0) {
            res.status(401).send(res.render('statusHandler', { statusMessage: 'Invalid email or password' }));
        } 
        else {
          const accLikes = await setVotes(resLog,1);
          const accDislikes = await setVotes(resLog,-1);
          res.cookie('accountID', resLog[0]['id']);
          res.cookie('postLikes', accLikes);
          res.cookie('postDislikes', accDislikes);
          res.status(200).send(res.render('statusHandler', { statusMessage: 'Logged in successfully' }));
        }
    });
  });
  
  










module.exports = appRouter;