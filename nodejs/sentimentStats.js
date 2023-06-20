
const { con } = require('./sql');
const express = require('express');
const appRouter = express.Router();


const path = require('path');
const projectPath = path.join(__dirname, "../");



function exeQuerySQL(query, params) {
  return new Promise((resolve, reject) => {
    con.query(query, params, (error, result) => {
      if (error) {
        reject(error);
      }
      else {
        resolve(result || []);
      }
    });
  });
}



appRouter.get('/getPostsDated', async (req, res) => {
  const { startDate, endDate, userIDs } = req.query;

  let datedPosts = [];
  for (i = 0; i < userIDs.length; i++) {
    datedPosts[i] = exeQuerySQL("SELECT id,authorID,sentimentScore,sentimentMagnitude,creationDate FROM posts WHERE creationDate >= ? AND creationDate <= ? AND authorID = ?", [startDate, endDate, userIDs[i]]);
  }

  try {
    const datedDetails = await Promise.all(datedPosts);
    res.send({ code: 200, posts: datedDetails });
  } 
  catch (error) {
    console.log(error);
    res.send({ code: 500, errorText: "appRouter.get(/getPostsDated) -> con.query(datedDetails)" });
  }
});



appRouter.get('/getPostsTaggedDated', async (req, res) => {
  const { startDate, endDate, tagIDs } = req.query;

  let postIDs = [];
  for (let i = 0; i < tagIDs.length; i++) {
    postIDs[i] = exeQuerySQL("SELECT postID FROM tagpostid WHERE tagID = ?", tagIDs[i]);
  }

  try {
    const postDetails = await Promise.all(postIDs);
    let datedPosts = [];
    for (let i = 0; i < postDetails.length; i++) {
      let innerPromises = [];
      for (let j = 0; j < postDetails[i].length; j++) {
        let result = await exeQuerySQL("SELECT id,authorID,sentimentScore,sentimentMagnitude,creationDate FROM posts WHERE creationDate >= ? AND creationDate <= ? AND id = ?", [startDate, endDate, postDetails[i][j].postID]);
        if (result.length > 0) {
          innerPromises.push(result[0]);
        }
      }
      datedPosts.push(await Promise.all(innerPromises));
    }

    try {
      const datedDetails = await Promise.all(datedPosts);
      res.send({ code: 200, posts: datedDetails });
    } 
    catch (error) {
      console.log(error);
      res.send({ code: 500, errorText: "appRouter.post(/getPostsTaggedDated) -> con.query(datedDetails)" });
    }
  } 
  catch (error) {
    console.log(error);
    res.send({ code: 500, errorText: "appRouter.get(/getPostsTaggedDated) -> con.query(postDetails)" });
  }
});



appRouter.get('/updateSentStats', (req, res) => {

  const contentQuery = new Promise((resolve, reject) => {
    con.query('SELECT content FROM posts WHERE authorID = ?', [req.query.userID], (error, resContent) => {
      if (error) {
        console.log(error);
        res.send({ code: 500, errorText: "appRouter.get(/updateSentStats) -> con.query(contentQuery)" });
        reject(error);
      } else {
        resolve(resContent);
      }
    });
  });

  contentQuery
  .then(async (resContent) => {
    let scoreSum = 0;
    let magnitudeSum = 0;
    let nrContent = 0;

    for (const post of resContent) {
      const { score, magnitude } = await analyzeText(post.content);
      scoreSum += score;
      magnitudeSum += magnitude;
      nrContent += 1;
    }

    let avgScore, avgMagnitude;

    if (scoreSum == 0) {
      avgScore = 0;
    }
    else {
      avgScore = scoreSum / nrContent;
    }

    if (magnitudeSum == 0) {
      avgMagnitude = 0;
    }
    else {
      avgMagnitude = magnitudeSum / nrContent;
    }

    con.query('UPDATE userdetails SET avgSentimentScore = ? WHERE userID = ?', [avgScore, req.query.userID], (error, result) => {
      if (error) {
        console.log(error);
        res.send({ code: 500, errorText: "appRouter.get(/updateSentStats) -> con.query(contentQuery)" });
      } 
      else {
        con.query('UPDATE userdetails SET avgSentimentMagnitude = ? WHERE userID = ?', [avgMagnitude, req.query.userID], (error, result) => {
          if (error) {
            console.log(error);
            res.send({ code: 500, errorText: "appRouter.get(/updateSentStats) -> con.query(contentQueryMagnitude)" });
          } 
          else {
            res.send({code: 200, sentScore: avgScore, sentMagnitude: avgMagnitude});
          }
        });
      }
    });

  })
  .catch((error) => {
    console.log(error);
    res.send({ code: 500, errorText: "appRouter.get(/updateSentStats) -> con.query(contentQuery)" });
  });
  
});



async function analyzeText(text) {
  const language = require('@google-cloud/language');
  const client = new language.LanguageServiceClient();
  
  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };
  
  const [result] = await client.analyzeSentiment({ document });
  
  return {
    score: result.documentSentiment.score,
    magnitude: result.documentSentiment.magnitude,
  };
}



appRouter.get('/getListUsers',(req,res) => {
  con.query("SELECT * FROM userdetails", (error, resUsers) => {
    if (error) {
      console.log(error);
      res.send({ code: 500, errorText: "appRouter.get(/getListUsers) -> con.query(queryUsers)" });
    }
    else {
      res.send({code: 200, users: resUsers});
    }
  });
});

appRouter.get('/getListTags',(req,res) => {
  con.query("SELECT * FROM tags", (error, resTags) => {
    if (error) {
      console.log(error);
      res.send({ code: 500, errorText: "appRouter.get(/getListTags) -> con.query(queryTags)" });
    }
    else {
      res.send({code: 200, tags: resTags});
    }
  });
});

    
    
    
module.exports = appRouter;