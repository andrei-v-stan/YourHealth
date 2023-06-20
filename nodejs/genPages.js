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
  const postID = req.params.id;

  if (/[^0-9]/.test(postID) || /^0/.test(postID) || req.url.length > `/posts/${postID}`.length) {
    res.render('statusHandler', { statusMessage: 'This user does not exist' });
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
        res.sendFile(path.join(__dirname, '../html', 'userDetails.html'));
      }
    });
  }
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