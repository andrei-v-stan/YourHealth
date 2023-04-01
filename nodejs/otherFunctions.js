
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
              res.status(200).redirect('/');
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

var mailDetails = {
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



appRouter.get('/posts', (req, res) => {
  con.query('SELECT * FROM posts ORDER BY creationDate DESC', (err, result) => {
    if (err) {
      throw err;
    }
    res.send(`
      <html>
        <body>
          <h1>Page</h1>
          <ul>
            ${result.map(post => `<li><a href="/posts/${post.id}">${post.title}</a></li>`).join('')}
          </ul>
          <a href="/posts/new">New Post</a>
        </body>
      </html>
    `);
  });
});



appRouter.get('/posts/:id', (req, res) => {
  const postId = req.params.id;
  con.query('SELECT * FROM posts WHERE id = ?', [postId], (err, result) => {
    if (err) {
      throw err;
    }
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
    });
  });




appRouter.post('/location', (req, res) => {
  const { lat, long, acc } = req.body;
  var queryLocation;
  var accID;

  if(!req.cookies.accountID)  {
    accID = 0;
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


module.exports = appRouter;