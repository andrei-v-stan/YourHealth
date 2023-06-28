const { con } = require('./sql');
const express = require('express');
const appRouter = express.Router();



function exeQuerySQL(query, params) {
  return new Promise((resolve, reject) => {
    con.query(query, params, (error, result) => {
      if (error) {
        console.log('[Error]: exeQuerySQL -> con.query(query)');
        console.log(error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}





appRouter.get('/getUserNames', async (req, res) => {
  const authorIDs = req.query.authorIDs;

  if (!authorIDs) {
    res.send({ code: 200, users: "" });
  }
  else {
    let userData = [];
    for (let i = 0; i < authorIDs.length; i++) {
      //SELECT IF(displayname IS NOT NULL, displayname, username) AS resultName, userID FROM userdetails WHERE userID = ?
      userData[i] = exeQuerySQL("SELECT userID, displayname, username FROM userdetails WHERE userID = ?", authorIDs[i]);
    }
  
    try {
      const userDetails = await Promise.all(userData);
      res.send({ code: 200, users: userDetails });
    } 
    catch (error) {
      console.log(error);
      res.send({ code: 500, errorText: "appRouter.get(/getUserNames) -> con.query(userDetails)" });
    }
  }
});



appRouter.get('/getPostTags', async (req, res) => {
  const postIDs = req.query.postIDs;

  if (!postIDs) {
    res.send({ code: 200, postsTags: "", tags: "" });
  }
  else {
    let tagIDs = [];
    for (let i = 0; i < postIDs.length; i++) {
      tagIDs[i] = exeQuerySQL("SELECT tagID FROM tagpostid WHERE postID = ?", postIDs[i]);
    }

    try {
      const tagDetails = await Promise.all(tagIDs);

      let uniqTagIDs = [], j = 0;
      tagDetails.forEach(tagGroup => {
        tagGroup.forEach(tagDetails => {
          const tagID = tagDetails.tagID;
          if (!uniqTagIDs.includes(tagID)) {
            uniqTagIDs[j] = tagID;
            j++;
          }
        });
      });

      let tagsData = [];
      for (let i = 0; i < uniqTagIDs.length; i++) {
        tagsData[i] = exeQuerySQL("SELECT * FROM tags WHERE id = ?", uniqTagIDs[i]);
      }

      try {
        const tagsInfo = await Promise.all(tagsData);
        res.send({ code: 200, postsTags: tagDetails, tags: tagsInfo });
      } 
      catch (error) {
        console.log(error);
        res.send({ code: 500, errorText: "appRouter.get(/getPostTags) -> con.query(tagsInfo)" });
      }
    } 
    catch (error) {
      console.log(error);
      res.send({ code: 500, errorText: "appRouter.get(/getPostTags) -> con.query(tagDetails)" });
    }
  }
});









appRouter.get('/getPosts',(req,res) => {
  const { inputDetails, searchingFor, sortMethod, tagFilters } = req.query;

  let queryData = "";
  if (inputDetails != "") {
    if (searchingFor == "postTitle") {
      queryData = `WHERE LOWER(title) LIKE '%${inputDetails}%'` ;
    }
    else if (searchingFor == "postContent") {
      queryData = `WHERE LOWER(content) LIKE '%${inputDetails}%'` ;
    }
  }

  let queryAllPosts = '';
  switch(sortMethod) {
    case "recommendedPosts":
        queryAllPosts = `SELECT * FROM posts ${queryData} ORDER BY title ASC`;
        break;
    case "hotPosts":
      if (inputDetails != "") {
        queryData += ' AND'
      }
      else {
        queryData = 'WHERE'
      }
        queryAllPosts = `SELECT * FROM posts ${queryData} creationDate >= NOW() - INTERVAL 1 DAY ORDER BY voteCount DESC`;
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
        console.log(error);
        res.send({code: 500, errorText: "[Error]: appRouter.post(/getPosts) -> con.query(queryAllPosts)"});
      }
      else {
        res.send({code: 200, posts: resultPosts});
      }
    });
  }
  else {

    if (inputDetails != "") {
      queryData = queryData + ' AND';
    }
    else {
      queryData = 'WHERE';
    }

    let givenTags = tagFilters.map(item => `'${item}'`).join(',');
    let queryFilters = 
    `SELECT * FROM posts ${queryData} id IN (
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
        console.log(error);
        res.send({code: 500, errorText: "[Error]: appRouter.post(/getPosts) -> con.query(queryFilters)"});
      }
      else {
        res.send({code: 200, posts: resultPosts});
      }
    });
  }
});



appRouter.get('/getUsers',(req,res) => {
  const inputDetails = req.query.inputDetails;
  let queryUsers = `SELECT * FROM userdetails`;
 
  if (inputDetails != "") {
    queryUsers = queryUsers + ` WHERE (displayName LIKE '%${inputDetails}%' OR username LIKE '%@${inputDetails}%')`;
  }

  con.query(queryUsers, (error, resultUsers) => {
    if (error) {
      console.log(error);
      res.send({ code: 500, errorText: "appRouter.get(/posts) -> con.query(queryUsers)" });
    }
    else {
      res.send({code: 200, users: resultUsers});
    }
  });
});


appRouter.get('/searchUsers',(req,res) => {
  const inputDetails = req.query.inputDetails;
  let queryUsers = `SELECT * FROM userdetails`;
 
  if (inputDetails != "") {
    queryUsers = queryUsers + ` WHERE (displayName LIKE '%${inputDetails}%' OR username LIKE '%@${inputDetails}%')`;
  }

  con.query(queryUsers, (error, resultUsers) => {
    if (error) {
      console.log(error);
      res.send({ code: 500, errorText: "appRouter.get(/searchUsers) -> con.query(queryUsers)" });
    }
    else {
      res.send({code: 200, users: resultUsers});
    }
  });
});



appRouter.get('/getVotes',(req, res) => {
  let queryVotes = `SELECT * FROM postlikes WHERE userID = '${req.query.accountID}'`;
  con.query(queryVotes, (error, result) => {
    if (error) {
      console.log(error);
      res.send({code: 500, errorText: "[Error]: appRouter.post(/getVotes) -> con.query(queryVotes)"});
    }
    else {
      res.send({code: 200, votes: result});
    }
  });
})




appRouter.post('/votePost', (req, res) => {
  const { userID, postID, vote } = req.body;
  const voteQuery = new Promise((resolve, reject) => {
    con.query('SELECT vote FROM postlikes WHERE (postID=? AND userID=?)', [postID, userID], (error, voteScore) => {
      if (error) {
        console.log('[Error]: appRouter.post.(voteQuery) -> con.query(WHERE (postID=? AND userID=?))');
        console.log(error);
        reject(error);
      } else {
        resolve(voteScore);
      }
    });
  });

  voteQuery.then((voteScore) => {
    let newVote = vote;

    let voteInsert;
    if (voteScore.length == 0) {
      voteInsert = new Promise((resolve, reject) => {
        con.query('INSERT INTO postlikes (`postID`, `userID`, `vote`) VALUES (?, ?, ?)', [postID, userID, vote], (error, result) => {
          if (error) {
            console.log('[Error]: appRouter.post.(voteQuery) -> con.query(INSERT INTO postlikes)');
            console.log(error);
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    } else {
      if (voteScore[0].vote == vote) {
        newVote = 0;
      }
      voteInsert = new Promise((resolve, reject) => {
        con.query('UPDATE postlikes SET vote = ? WHERE (postID=? AND userID=?)', [newVote, postID, userID], (error, result) => {
          if (error) {
            console.log('[Error]: appRouter.post.(voteQuery) -> con.query(UPDATE postlikes)');
            console.log(error);
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    }

    voteInsert
    .then(() => {
      con.query(`SELECT COUNT(*) FROM postlikes WHERE (vote=1 AND postID=${postID})`, (error, resV1) => {
        if (error) {
          console.log(error);
          res.send({ code: 500, errorText: "appRouter.get(/voteInsert) -> con.query(postlikes WHERE vote=1)" });
        }
        con.query(`SELECT COUNT(*) FROM postlikes WHERE (vote=-1 AND postID=${postID})`, (error, resV0) => {
          if (error) {
            console.log(error);
            res.send({ code: 500, errorText: "appRouter.get(/voteInsert) -> con.query(postlikes WHERE vote=-1)" });
          }
          const voteCt = parseInt(resV1[0]['COUNT(*)']) - parseInt(resV0[0]['COUNT(*)']);
          con.query(`UPDATE posts SET voteCount=${voteCt} WHERE id=${postID}`, (error, result) => {
            if (error) {
              console.log(error);
              res.send({ code: 500, errorText: "appRouter.get(/voteInsert) -> con.query(UPDATE posts SET voteCount)" });
            }
            con.query(`SELECT voteCount FROM posts WHERE id=${postID}`, (error, resultVal) => {
              if (error) {
                console.log(error);
                res.send({ code: 500, errorText: "appRouter.get(/voteInsert) -> con.query(UPDATE posts SET voteCount)" });
              }
              else {
                res.send({code: 200, voteResult: newVote, countResult: resultVal});
              }
            });
          });
        });
      });
      
    })
    .catch((error) => {
      console.log(error);
      res.send({ code: 500, errorText: "appRouter.get(/votePost) -> con.query(voteInsert)" });
    });
  })
  .catch((error) => {
    console.log(error);
    res.send({ code: 500, errorText: "appRouter.get(/votePost) -> con.query(voteQuery)" });
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

appRouter.post('/postBookmark',(req, res) => {
  const { userID, postID } = req.body;

  const bookmarkQuery = new Promise((resolve, reject) => {
    con.query('SELECT postID FROM bookmarkedposts WHERE (postID=? AND userID=?)', [postID, userID], (error, resBookmark) => {
      if (error) {
        console.log('[Error]: appRouter.post.(bookmarkQuery) -> con.query(WHERE (postID=? AND userID=?))');
        console.log(error);
        reject(error);
      } else {
        resolve(resBookmark);
      }
    });
  });
  
  bookmarkQuery.then((existingBookmark) => {
    if (existingBookmark.length == 0) {
      con.query('INSERT INTO bookmarkedposts (userID, postID) VALUES (?, ?)', [userID, postID], (error, result) => {
        if (error) {
          console.log(error);
          res.send({ code: 500, errorText: "appRouter.post(/postBookmark) -> con.query(bookmarkQuery)" });
        }
        else {
          res.send({code: 200, bookmark: "created"});
        }
      });
    }
    else {
      con.query('DELETE FROM bookmarkedposts WHERE (userID=? and postID=?)', [userID, postID], (error, result) => {
        if (error) {
          console.log(error);
          res.send({ code: 500, errorText: "appRouter.post(/postBookmark) -> con.query(bookmarkQuery)" });
        }
        else {
          res.send({code: 200, bookmark: "deleted"});
        }
      });
    } 
  })
  .catch((error) => {
    console.log(error);
    res.send({ code: 500, errorText: "appRouter.get(/postBookmark) -> con.query(bookmarkQuery)" });
  });
})







appRouter.get('/getHidden',(req, res) => {
  con.query(`SELECT postID FROM hiddenposts WHERE userID = '${req.query.accountID}'`, (error, resHidden) => {
    if (error) {
      console.log(error);
      res.send({code: 500, errorText: "[Error]: appRouter.post(/getHidden) -> con.query()"});
    }
    else {
      res.send({code: 200, hiddenData: resHidden});
    }
  });
})

appRouter.post('/postHidden',(req, res) => {
  const { userID, postID } = req.body;

  const hiddenQuery = new Promise((resolve, reject) => {
    con.query('SELECT postID FROM hiddenposts WHERE (postID=? AND userID=?)', [postID, userID], (error, resHidden) => {
      if (error) {
        console.log('[Error]: appRouter.post.(hiddenQuery) -> con.query(WHERE (postID=? AND userID=?))');
        console.log(error);
        reject(error);
      } else {
        resolve(resHidden);
      }
    });
  });
  
  hiddenQuery
  .then((existingHidden) => {
    if (existingHidden.length == 0) {
      con.query('INSERT INTO hiddenposts (userID, postID) VALUES (?, ?)', [userID, postID], (error, result) => {
        if (error) {
          console.log(error);
          res.send({ code: 500, errorText: "appRouter.post(/postHidden) -> con.query(hiddenQuery)" });
        }
        else {
          res.send({code: 200, hidden: "created"});
        }
      });
    }
    else {
      con.query('DELETE FROM hiddenposts WHERE (userID=? and postID=?)', [userID, postID], (error, result) => {
        if (error) {
          console.log(error);
          res.send({ code: 500, errorText: "appRouter.post(/postHidden) -> con.query(hiddenQuery)" });
        }
        else {
          res.send({code: 200, hidden: "deleted"});
        }
      });
    } 
  })
  .catch((error) => {
    console.log(error);
    res.send({ code: 500, errorText: "appRouter.get(/postHidden) -> con.query(hiddenQuery)" });
  });
})


module.exports = appRouter;