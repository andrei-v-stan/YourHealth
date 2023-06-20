
const fs = require('fs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const { con } = require('./sql');
const express = require('express');
const appRouter = express.Router();


  
appRouter.post('/updateLocation', (req, res) => {
  const { lat, lng, acc, accID } = req.body;

  const queryLocation = `INSERT INTO userlocs (accountID, latitude, longitude, accuracy, recordingStamp) VALUES ('${accID}', ${lat}, ${lng}, ${acc}, NOW())`;
  con.query(queryLocation, (error, result) => {
    if (error) {
      console.log(error);
      res.send({code: 500, errorText: "[Error]: appRouter.post(/updateLocation) -> con.query(queryLocation)"});
    }
  });
});



appRouter.get('/getFilters',(req, res) => {
  const queryAllTags = 'SELECT * FROM tags ORDER BY title ASC';

  con.query(queryAllTags, (error, resultTags) => {
      if (error) {
        console.log(error);
        res.send({code: 500, errorText: "[Error]: appRouter.get(/getFilters) -> con.query(queryAllTags)"});
      }
      else {
        res.send({code: 200, tags: resultTags});
      }
    });
})





appRouter.get('/signupUsernameCheck', (req, res) => {

  const queryCheck = `SELECT id FROM usercreds WHERE username="${req.query.username}"`;
  con.query(queryCheck, (error, resCheck) => {
    if (error) {
        console.log(error);
        res.send({code: 500, errorText: "[Error]: appRouter.get(/signupUsernameCheck) -> con.query(queryCheck)"});
    }
    else if (resCheck.length == 0) {
        res.send({code: 200});
    }
    else {
        res.send({code: 100});
    }
  });
});



appRouter.post('/signupEmailCheck', (req, res) => {

  const queryCheck = `SELECT id FROM usercreds WHERE email="${req.body.email}"`;
  con.query(queryCheck, (error, resCheck) => {
    if (error) {
      console.log(error);
      res.send({code: 500, errorText: "[Error]: appRouter.get(/signupEmailCheck) -> con.query(queryCheck)"});
    }
    else if (resCheck.length == 0) {
      res.send({code: 200});
    }
    else {
      res.send({code: 100});
    }
  });
});
  

  
 
  
appRouter.post('/signup', (req, res) => {
  const { username, password, email } = req.body;

  const querySignUp = `INSERT INTO usercreds (username, password, email) VALUES (?, ?, ?)`;
  const querySignUpDetails = `INSERT INTO userdetails (userID, username, clearance, title) VALUES (?, ?, ?, ?)`;
  con.query(querySignUp, [username, password, email], (error, resSignup) => {
    if (error) {
      console.log(error);
      res.send({code: 500, errorText: "[Error]: appRouter.post(/signup) -> con.query(querySignUp)"});
    }
    else {
      con.query(querySignUpDetails, [resSignup.insertId, `@user${resSignup.insertId}`, 1, "Regular User"], (error, resSignup) => {
        if (error) {
          console.log(error);
          res.send({code: 500, errorText: "[Error]: appRouter.post(/signup) -> con.query(querySignUpDetails)"});
        }
        else {
          res.send({code: 200, accID: resSignup.insertId});
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
      console.log(error);
      res.send({code: 500, errorText: "[Error]: appRouter.post(/login) -> con.query(queryLogin)"});
    }
    else if (resID.length == 0) {
      res.send({code: 406});
    }
    else {

      res.send({code: 200, accID: `${resID[0]['id']}`})
    }
  });
});
  
  













function jsonRecKeys(recPassEmail) {
  const genBytes = crypto.randomBytes(32);
  let genStr = genBytes.toString('base64');
  genStr = genStr.replace(/[^a-zA-Z0-9]/g, '').substr(0, 64);

  let genDate = new Date();
  genDate = genDate.toLocaleString("en-US", { timeZone: "Europe/Bucharest" });

  const recoveryStr = {
      generatedString: genStr,
      generatedAt: genDate,
      generatedFor: recPassEmail
  };

  const recFile = JSON.parse(fs.readFileSync('./nodejs/recKeys.json'));
  recFile.recoveryPasskeys.push(recoveryStr);
  fs.writeFileSync('./nodejs/recKeys.json', JSON.stringify(recFile, null, 2));

  return genStr;
}


function recoverPassEmail(recPassEmail) {
  return new Promise((resolve, reject) => {
    const mailTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'yourmindfii@gmail.com',
            pass: 'hysdzhvknlpsbbmw'
        }
    });

    const generatedCode = jsonRecKeys(recPassEmail);
    let mailDetails = {
        from: 'yourmindfii@gmail.com',
        to: `${recPassEmail}`,
        subject: `[Your Mind] password recovery`,
        html: 
        `<p>Hello there, a request has been made for the recovery of your "Your Mind" account.</p>
        <br>
        <p>Click <a href="http://localhost:3000/recoverPassword/${generatedCode}">this link</a> to continue the steps towards resetting your account's password.</p>
        <br>
        <p>The link is valid for only 30 min, if there is any issue with the link please send another password recovery request.</p>
        <p color="red" font-size="16px">Do not send the link to anyone or you might lose access to your account!</p>`
    };
    
    mailTransport.sendMail(mailDetails, (error, result) => {
        if (error) {
          console.log('[Error]: recoverPassEmail() -> mailTransport.sendmail()');
          console.log(error);
          reject(error);
        } 
        else {
          resolve(200);
        }
      });
  });
}


appRouter.post('/recoverPass', (req, res) => {
  const email = req.body.email;

  const queryRecovery = `SELECT id FROM usercreds WHERE email = ?`;
  con.query(queryRecovery, [email], async (error, resID) => {
    if (error) {
      console.log(error);
      res.send({code: 500, errorText: "[Error]: appRouter.post(/recoverPass) -> con.query(queryRecovery)"});
    }
    else if (resID.length == 0) {
      res.send({code: 404});
    }
    else {
      try {
        const resCode = await recoverPassEmail(email);
        if (resCode == 200) {
          res.send({code: 200});
        }
      } 
      catch (error) {
        console.error(error);
        res.send({code: 412, errorText: "[Error]: appRouter.post(/recoverPass) -> recoverPassEmail()"});
      }
    }
  });
});
  
  
  
  


appRouter.get('/recoverPassword/:Code', (req, res) => {
  const passCode = req.params.Code;
  let passCodeEmail = 0;
  const recKeysData = JSON.parse(fs.readFileSync('./nodejs/recKeys.json'));
  const currentTime = new Date().getTime();
  let generatedAtTime;
  const minutes = 30;
  
  recKeysData.recoveryPasskeys.forEach((passkey, i) => {
      generatedAtTime = new Date(passkey.generatedAt).getTime();
      if (currentTime - generatedAtTime >= (minutes * 60 * 1000)) {
          recKeysData.recoveryPasskeys.splice(i, 1);
      }
  });
  fs.writeFileSync('./nodejs/recKeys.json', JSON.stringify(recKeysData));
  
  recKeysData.recoveryPasskeys.forEach((passkey, i) => {
      if (passCode == passkey.generatedString) {
          passCodeEmail = passkey.generatedFor;
      }
  });

  if (passCodeEmail != 0) {
      res.render('recoverPassword', { code: passCode, email: passCodeEmail });
  }
  else {
      res.status(404).send(res.render('statusHandler', { statusMessage: 'The link / code is no longer valid' }));
  }
});





appRouter.post('/mailContactForm', (req, res) => {
  const mailTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'yourmindfii@gmail.com',
          pass: 'hysdzhvknlpsbbmw'
      }
  });
  
  const { contactName, emailAddr, contactTopic, emailMessage } = req.body;
  let mailDetails = {
      from: `${emailAddr}`,
      to: 'yourmindfii@gmail.com',
      subject: `[${contactTopic}]`,
      html: `<p>From: ${contactName}</p> <br>
             <p>Email: ${emailAddr}</p> <br><br>
             <p>Message: ${emailMessage}</p>`
  };
  
  mailTransport.sendMail(mailDetails, (error, result) => {
      if (error) {
        console.log(error);
        res.send({code: 412, errorText: "[Error]: appRouter.post(/mailContactForm) -> mailTransport.sendmail()"});
      } else {
        res.send({code: 200});
      }
    });
});


appRouter.post('/mailReportContactForm', (req, res) => {
  const mailTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'yourmindfii@gmail.com',
          pass: 'hysdzhvknlpsbbmw'
      }
  });
  
  const { postID, contactTopic, emailMessage } = req.body;
  const accID = req.cookies.accountID;

  let mailDetails = {
      from: `yourmindfii@gmail.com`,
      to: 'yourmindfii@gmail.com',
      subject: `Post report:[${contactTopic}]`,
      html: `<p>From(ID): <a href="http://localhost:3000/users/${accID}"> No. ${accID} </a> </p> <br>
             <p>Post(ID): <a href="http://localhost:3000/posts/${postID}"> No. ${postID} </a> </p> <br>
             <p>Message: ${emailMessage}</p>`
  };
  
  mailTransport.sendMail(mailDetails, (error, result) => {
      if (error) {
        console.log(error);
        res.send({code: 500, errorText: "[Error]: appRouter.post(/mailReportContactForm) -> mailTransport.sendmail()"});
      } else {
        res.send({code: 200});
      }
    });
});




appRouter.post('/changePass', (req, res) => {
  const { password, email, genCode } = req.body;

  const queryUpdatePass = `UPDATE usercreds SET password = ? WHERE (email = ?)`
  con.query(queryUpdatePass, [password, email], (error, resID) => {
    if (error) {
      console.log(error);
      res.send({code: 500, errorText: "[Error]: appRouter.post(/changePass) -> con.query(queryUpdatePass)"});
    }
    else {
      const recKeysData = JSON.parse(fs.readFileSync('./nodejs/recKeys.json'));
      recKeysData.recoveryPasskeys.forEach((passkey, i) => {
          if (genCode == passkey.generatedString) {
              recKeysData.recoveryPasskeys.splice(i, 1);
          }
      });
      fs.writeFileSync('./nodejs/recKeys.json', JSON.stringify(recKeysData));
      res.send({code: 200});
    }
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



function executeQuery(query, params) {
  return new Promise((resolve, reject) => {
    con.query(query, params, (error, result) => {
      if (error) {
        console.log('[Error]: appRouter.(executeQuery) -> con.query(query)');
        console.log(error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}


async function updatePostTags(postTags, postID, res) {
  let errorLocation = "";
  let foundError = false;

  const queryInsertTags = `INSERT INTO tags (title) SELECT ? WHERE NOT EXISTS (SELECT 1 FROM tags WHERE title = ?);`;

  for (let i = 0; i < postTags.length; i++) {
    try {
      await executeQuery(queryInsertTags, [postTags[i], postTags[i]]);
    } catch (error) {
      foundError = true;
      errorLocation = "queryInsertTags";
      console.log(error);
      break;
    }
  }

  const queryInsertPostTag = `INSERT INTO tagpostid (postID, tagID) SELECT ?, id FROM tags WHERE title = ?;`;

  for (let i = 0; i < postTags.length; i++) {
    try {
      await executeQuery(queryInsertPostTag, [postID, postTags[i]]);
    } catch (error) {
      foundError = true;
      errorLocation = "queryInsertPostTag";
      console.log(error);
      break;
    }
  }

  if (!foundError) {
    return (200);
  } else {
    return (500, `[Error]: appRouter.post(/createPost) -> con.query(${errorLocation})`);
  }
}


appRouter.post('/createPost', (req, res) => {
  const { postTitle, postContent, postTags } = req.body;
  const authorID = req.cookies.accountID;

  const queryInsertPost = `INSERT INTO posts (title, content, authorID, creationDate) VALUES (?, ?, ?, NOW())`;
  const postQuery = new Promise((resolve, reject) => {
    con.query(queryInsertPost, [postTitle, postContent, authorID], (error, resPost) => {
      if (error) {
        console.log(error);
        res.send({ code: 500, errorText: "appRouter.post(/createPost) -> con.query(queryInsertPost)" });
      }
      else {
        resolve(resPost);
      }
    });
  });

  postQuery.then(async (resPost) => {
    const { score, magnitude } = await analyzeText(postContent);
    const postID = resPost.insertId;

    con.query('UPDATE posts SET sentimentScore = ?, sentimentMagnitude = ? WHERE id = ?', [score, magnitude, postID], (error, result) => {
      if (error) {
        console.log(error);
        res.send({code: 500, errorText: "[Error]: appRouter.post(/createPost) -> con.query(updateSentimentStats)"});
      }
      else if (!postTags) {
        res.send({code: 200});
      }
      else {
        const {errorCode, errorMessage} = updatePostTags(postTags,postID);
        if (errorCode == 200) {
          res.send({code: 200});
        }
        else {
          res.send({code: 200, errorText: errorMessage});
        }
      }
    });

  }).catch((error) => {
    console.log(error);
    res.send({code: 500, errorText: "[Error]:  There has been a issue with the {try} of: appRouter.post(/createPost) -> con.query(updateSentimentStats)"});
  });
});

/*

  const queryInsertPost = `INSERT INTO posts (title, content, authorID, creationDate) VALUES (?, ?, ?, NOW())`;
  const queryGetPostId = `SELECT MAX(id) FROM posts WHERE authorID = ?`
  const queryInsertTags = `INSERT INTO tags (title) SELECT ? WHERE NOT EXISTS (SELECT 1 FROM tags WHERE title = ?);`;
  const queryInsertPostTag = `INSERT INTO tagpostid (postID, tagID) SELECT ?, id FROM tags WHERE title = ?;`;
  
  const errorHtml = `
    <html>
      <body>
        <p>There has been an error trying to create your post... Redirecting in: <span id="countdown">5</span></p>
        <script src="js/other.js"></script>
      </body>
    </html>
    `;

  let noTags = false;
  let foundError = false;
  let postID;
  let newTags;


  if (newTag == undefined) {
    noTags = true;
  }
  else if(Array.isArray(newTag) == true) {
    newTags = Array.from(new Set(newTag));
    newTags = Object.entries(newTags).map(([key, value]) => `${value}`);
  }
  else {
    newTags = new Array(1);
    newTags[0] = newTag;
  }


  if (!req.cookies.accountID) {
    res.status(401).send(`
      <html>
        <body>
          <p>You need to be signed in to create a post... Redirecting in: <span id="countdown">5</span></p>
          <script src="js/other.js"></script>
        </body>
      </html>
    `);
  } else {
    con.getConnection((error, conn) => {
      if (error) {
        console.log('[Error]: appRouter.get() -> con.getConnection()');
        console.error(error);
        return res.status(500).send(errorHtml);
      }

      conn.beginTransaction(error => {
        if (error) {
          console.log('[Error]: appRouter.get() -> conn.beginTransaction()');
          console.error(error);
          return res.status(500).send(errorHtml);
        }

        conn.query(queryInsertPost, [titlePost, contentPost, req.cookies.accountID], (error, result) => {
          if (error) {
            console.log('[Error]: appRouter.get() -> conn.query(queryInsertPost)');
            console.error(error);
            return conn.rollback(() => res.status(500).send(errorHtml));
          }
          postID = result.insertId;
          conn.commit(error => {
            if (error) {
              console.log('[Error]: appRouter.get() -> conn.commit() <- For the first commit (conn.query(queryInsertPost))');
              console.error(error);
              return conn.rollback(() => res.status(500).send(errorHtml));
            }
          });
        });

        if (noTags == false) {
          conn.query(queryGetPostId, [req.cookies.accountID], (error, result) => {
            if (error) {
              console.log('[Error]: appRouter.get() -> conn.query(queryGetPostId)');
              console.error(error);
              return conn.rollback(() => res.status(500).send(errorHtml));
            }

            postID = result[0]['MAX(id)'];
            for (i=0; i<newTags.length; i++) {
              conn.query(queryInsertTags, [newTags[i], newTags[i]], (error, result) => {
                if (error) {
                  console.log('[Error]: appRouter.get() -> conn.query(queryInsertTags)');
                  console.error(error);
                  return conn.rollback(() => res.status(500).send(errorHtml));
                }
              });
            }

              for (i=0; i<newTags.length; i++) {
                conn.query(queryInsertPostTag, [postID, newTags[i]], (error, result) => {
                  if (error) {
                    console.log('[Error]: appRouter.get() -> conn.query(queryInsertPostTag)');
                    console.error(error);
                    return conn.rollback(() => res.status(500).send(errorHtml));
                  }
                });
              }

              conn.commit(error => {
                if (error) {
                  console.log('[Error]: appRouter.get() -> conn.commit() <- For the second commit (if (noTags == false))');
                  console.error(error);
                  return conn.rollback(() => res.status(500).send(errorHtml));
                }
              });

          });
         }
        });
    });
  }
  res.status(200).redirect('/posts');
*/






  

appRouter.get('/checkUserAccess', (req, res) => {
  const accID = req.cookies.accountID;

  let clearanceQuery = "SELECT IF(clearance > 2, 'true', 'false') AS result FROM userdetails WHERE userID = ?";
  con.query(clearanceQuery, [accID], (error, result) => {
    if (error) {
      console.log(error);
      res.send({ code: 500, errorText: "appRouter.get(/checkUserAccess) -> con.query(clearanceQuery)" });
    } 
    else {
      res.send({code: 200, answer: result[0].result});
    }
  });

});
  




module.exports = appRouter;