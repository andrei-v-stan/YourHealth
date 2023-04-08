const { con } = require('./sql');
const express = require('express');
const appRouter = express.Router();



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



appRouter.post('/login', async (req, res) => {
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



appRouter.post('/signup', (req, res) => {
  const { username, password, email } = req.body;
  const querySignUp = `INSERT INTO usercreds (username, password, email) VALUES (?, ?, ?)`;
  const queryAccEmail = `SELECT 1 FROM usercreds WHERE email = ? LIMIT 1`;
  const queryAccUsername = `SELECT 1 FROM usercreds WHERE username = ? LIMIT 1`;
  const queryAccId = `SELECT id FROM usercreds WHERE (username=? AND password=? AND email=?)`;

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
              con.query(queryAccId, [username, password, email], (error, resID) => {
                if (error) {
                  console.log('[Error]: appRouter.post(/signup) -> con.query(queryAccId)');
                  console.error(error);
                  res.status(500).send(res.render('statusHandler', { statusMessage: 'There has been an internal server error' }));
                }
                else {
                  res.redirect(`/json/${resID[0]['id']}`);
                }
              });
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



appRouter.post('/logout', (req, res) => {
  const cookies = Object.keys(req.cookies);
  cookies.forEach(cookieName => {
    res.clearCookie(cookieName);
  });
  res.status(200).send(res.render('statusHandler', { statusMessage: 'Logged out successfully' }));
});




module.exports = appRouter;