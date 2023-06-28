const { con } = require('./sql');
const express = require('express');
const appRouter = express.Router();

const path = require('path');


appRouter.get('/posts/:id', (req, res) => {
  const postID = req.params.id;

  if (/[^0-9]/.test(postID) || /^0/.test(postID) || req.url.length > `/posts/${postID}`.length) {
    res.render('statusHandler', { statusMessage: 'This post does not exist' });
  }
  else {
    con.query('SELECT * FROM posts WHERE id=?', postID, (error, result) => {
      if (error) {
        console.log(error);
        res.send({ code: 500, errorText: "appRouter.get(/posts/:id) -> con.query(SELECT * FROM posts WHERE id=?)" });
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


appRouter.get('/users/:id', (req, res) => {
  const userID = req.params.id;

  if (/[^0-9]/.test(userID) || /^0/.test(userID) || req.url.length > `/users/${userID}`.length) {
    res.render('statusHandler', { statusMessage: 'This user does not exist' });
  }
  else {
    con.query('SELECT * FROM userdetails WHERE userID=?', userID, (error, result) => {
      if (error) {
        console.log(error);
        res.send({ code: 500, errorText: "appRouter.get(/users/:id) -> con.query(SELECT * FROM userdetails WHERE id=?)" });
      }
      if (Object.keys(result).length == 0) {
          res.render('statusHandler', { statusMessage: 'This user does not exist' });
      }
      else {
        res.sendFile(path.join(__dirname, '../html', 'userDetails.html'));
      }
    });
  }
});


appRouter.get('/editingUser/:id', (req, res) => {
  const userID = req.params.id;

  if (/[^0-9]/.test(userID) || /^0/.test(userID) || req.url.length > `/editingUser/${userID}`.length) {
    res.render('statusHandler', { statusMessage: 'This user does not exist' });
  }
  else {
    con.query('SELECT * FROM userdetails WHERE userID=?', userID, (error, result) => {
      if (error) {
        console.log(error);
        res.send({ code: 500, errorText: "appRouter.get(/editingUser/:id) -> con.query(SELECT * FROM userdetails WHERE userID=?)" });
      }
      if (Object.keys(result).length == 0) {
          res.render('statusHandler', { statusMessage: 'This user does not exist' });
      }
      else {
        if (result[0].userID == req.cookies.accountID) {
          res.sendFile(path.join(__dirname, '../html', 'editingUser.html'));
        }
        else {
          con.query('SELECT * FROM userdetails WHERE userID=?', req.cookies.accountID, (error, resultClear) => {
            if (error) {
              console.log(error);
              res.send({ code: 500, errorText: "appRouter.get(/editingUser/:id) -> con.query(SELECT * FROM userdetails WHERE userID=?)" });
            }
            else {
              if (resultClear[0].clearance >= 9) {
                res.sendFile(path.join(__dirname, '../html', 'editingUser.html'));
              }
              else {
                res.render('statusHandler', { statusMessage: 'You do not have permission to access this user edit' });
              }
            }
          });
        }
      }
    });
  }
});


appRouter.get('/editingUser', (req, res) => {
  const userID = req.cookies.accountID;
  res.redirect(`/editingUser/${userID}`);
});


appRouter.get('/getUser',(req,res) => {
  const userID = req.query.inputDetails;

  let queryUsers = `SELECT * FROM userdetails WHERE userID=?`;
  con.query(queryUsers, userID, (error, resultUser) => {
    if (error) {
      console.log(error);
      res.send({ code: 500, errorText: "appRouter.get(/getUser) -> con.query(getUser)" });
    }
    else {
      res.send({code: 200, user: resultUser});
    }
  });
});

appRouter.post('/updateUserDetail', (req, res) => {
  const { userID, updateText, updateDetail } = req.body;
  
  const queryUpdateDetail = `UPDATE userdetails SET ${updateDetail} = ? WHERE userID = ?`;
  con.query(queryUpdateDetail, [updateText, userID], (error, result) => {
    if (error) {
      console.log('[Error]: appRouter.post(/updateUserDetail) -> con.query(queryUpdateDetail)');
      console.error(error);
      res.send({code: 500});
    }
    else {
      res.send({code: 200});
    }
  });
});



appRouter.get('/missingLogin', (req, res) => {
  res.sendFile(path.join(__dirname, '../html', 'missingLogin.html'));
});

appRouter.get('/resourcesMap', (req, res) => {
  res.sendFile(path.join(__dirname, '../html', 'resourcesMap.html'));
});

appRouter.get('/sentimentStats', (req, res) => {
  res.sendFile(path.join(__dirname, '../html', 'sentimentStats.html'));
});

appRouter.get('/additionalInfo', (req, res) => {
  res.sendFile(path.join(__dirname, '../html', 'additionalInfo.html'));
});

appRouter.get('/yourHealth', (req, res) => {
  res.sendFile(path.join(__dirname, '../html', 'yourHealth.html'));
});




appRouter.get('/getPostDetails', (req, res) => {
  const postID = req.query.postID;
  const accID = req.cookies.accountID;

  const postDetails = new Promise((resolve, reject) => {
    con.query('SELECT * FROM posts WHERE id=?', postID, (error, resPostDetails) => {
      if (error) {
        console.log('[Error]: appRouter.post(/getPostDetails) -> con.query(resPostDetails)');
        console.error(error);
        reject(error);
      } 
      else {
        resolve(resPostDetails[0]);
      }
    });
  });

  const postComments = new Promise((resolve, reject) => {
    con.query('SELECT * FROM comments WHERE postID=?', postID, (error, resComments) => {
      if (error) {
        console.log('[Error]: appRouter.post(/getPostDetails) -> con.query(resComments)');
        console.error(error);
        reject(error);
      } 
      else {
        resolve(resComments);
      }
    });
  });

  const postVote = new Promise((resolve, reject) => {
    con.query('SELECT vote FROM postlikes WHERE postID = ? AND userID = ?', [postID, accID], (error, resPostVote) => {
      if (error) {
        console.log('[Error]: appRouter.post(/getPostDetails) -> con.query(resPostVote)');
        console.error(error);
        reject(error);
      } 
      else {
        let voteScore = 0;
        if (resPostVote.length > 0) {
          voteScore = resPostVote[0].vote;
        }
        resolve(voteScore);
      }
    });
  });

  const userTitle = new Promise((resolve, reject) => {
    con.query('SELECT CASE WHEN displayName IS NULL THEN username ELSE displayName END AS result FROM userdetails WHERE userID = ?', [accID], (error, resUser) => {
      if (error) {
        console.log('[Error]: appRouter.post(/getPostDetails) -> con.query(resUser)');
        console.error(error);
        reject(error);
      } 
      else {
        resolve(resUser[0]);
      }
    });
  });

  const postTags = new Promise((resolve, reject) => {
    con.query('SELECT tagID FROM tagpostid WHERE postID = ?', [postID], (error, resTags) => {
      if (error) {
        console.log('[Error]: appRouter.post(/getPostDetails) -> con.query(resTags)');
        console.error(error);
        reject(error);
      } 
      else {
        let tagsData = [];
        let completedQueries = 0;

        for (let i = 0; i < resTags.length; i++) {
          con.query('SELECT title FROM tags WHERE id = ?', [resTags[i].tagID], (error, resTagTitle) => {
            if (error) {
              console.log('[Error]: appRouter.post(/getPostDetails) -> con.query(resTagTitle)');
              console.error(error);
              reject(error);
            } else {
              tagsData[i] = { tagID: resTags[i].tagID, tagTitle: resTagTitle[0].title };
              completedQueries++;

              if (completedQueries == resTags.length) {
                resolve(tagsData);
              }
            }
          });
        }
      }
    });
  });

  Promise.all([postDetails, postComments, postVote, userTitle, postTags])
  .then(([postDetails, postComments, postVote, userTitle, postTags]) => {
    res.send({ code: 200, postDetails, postComments, postVote, userTitle, postTags });
  })
  .catch((error) => {
    console.log('[Error]: appRouter.post(/getPostDetails)');
    console.error(error);
    res.send({ code: 500, errorText: "appRouter.post(/getPostDetails)" });
  });
});


appRouter.get('/getBookmarks',(req, res) => {
  con.query(`SELECT postID FROM bookmarkedposts WHERE userID = '${req.query.accountID}'`, (error, resBookmarks) => {
    if (error) {
      console.log(error);
      res.send({code: 500, errorText: "[Error]: appRouter.post(/getBookmarks) -> con.query()"});
    }
    else {
      res.send({code: 200, bookmarkData: resBookmarks});
    }
  });
})




appRouter.get('/submitComment', (req, res) => {
  const { postID, parentID, parentType, content } = req.query;
  const authorID = req.cookies.accountID;
  const queryPostComment = "INSERT INTO comments (postID, parentID, parentType, authorID, content) VALUES (?, ?, ?, ?, ?)";
  const queryUpdateCount = "UPDATE posts SET commentCount = commentCount + 1 WHERE id = ?";

  con.query(queryPostComment, [postID, parentID, parentType, authorID, content, '0'], (error, result) => {
    if (error) {
      console.log('[Error]: appRouter.post(/submitComment) -> con.query(queryPostComment)');
      console.error(error);
      res.send({code: 500});
    }
    else {
      con.query(queryUpdateCount, [postID], (error, result) => {
        if (error) {
          console.log('[Error]: appRouter.post(/submitComment) -> con.query(queryPostComment)');
          console.error(error);
          res.send({code: 500});
        }
        else {
          res.send({code: 200});
        }
      });
    }
  });
});



  module.exports = appRouter;