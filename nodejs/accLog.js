const { con } = require('./sql');
const express = require('express');
const appRouter = express.Router();



appRouter.post('/signupUsernameCheck', (req, res) => {
  const queryCheck = `SELECT id FROM usercreds WHERE username="${req.body.username}"`;
    con.query(queryCheck, (error, resCheck) => {
      if (error) {
        console.log('[Error]: appRouter.post(/signupUsernameCheck) -> con.query(queryCheck)');
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
          res.send({code: 200, accID: resID[0]['id']});
        }
      });
    }
  });
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
        console.log(accDislikes);
      }
      resolve(accDislikes);
    });
  });
}




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
      res.send({code: 200, accID: resID[0]['id']});
    }
  });
});






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




appRouter.post('/logout', (req, res) => {
  const cookies = Object.keys(req.cookies);
  cookies.forEach(cookieName => {
    res.clearCookie(cookieName);
  });
  res.status(200).send(res.render('statusHandler', { statusMessage: 'Logged out successfully' }));
});




module.exports = appRouter;