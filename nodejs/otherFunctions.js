
const nodemailer = require('nodemailer');

const { con } = require('./sql');
const express = require('express');
const appRouter = express.Router();

const errorHtml = `
<html>
  <body>
    <p>There has been an internal server error... Redirecting in: <span id="countdown">5</span></p>
    <script src="js/countRedirect.js"></script>
  </body>
</html>
`;



appRouter.post('/signup', (req, res) => {
  const { username, password, email } = req.body;
  const querySignUp = `INSERT INTO usercreds (username, password, email) VALUES (?, ?, ?)`;
  const queryAccEmail = `SELECT 1 FROM usercreds WHERE email = ? LIMIT 1`;
  const queryAccUsername = `SELECT 1 FROM usercreds WHERE username = ? LIMIT 1`;

  con.query(queryAccUsername, [username], (error, result) => {
    if (error) {
      console.log('[Error]: appRouter.get() -> con.query(queryAccUsername)');
      console.error(error);
      res.status(500).send(errorHtml);
    }
    if (result == 0) {
      con.query(queryAccEmail, [email], (error, result) => {
        if (error) {
          console.log('[Error]: appRouter.get() -> con.query(queryAccEmail)');
          console.error(error);
          res.status(500).send(errorHtml);
        }
        if (result == 0) {
          con.query(querySignUp, [username, password, email], (error, results) => {
            if (error) {
              console.log('[Error]: appRouter.get() -> con.query(querySignUp)');
              console.error(error);
              res.status(500).send(errorHtml);
            }
            else {
              res.status(200).redirect('/');
            }
          });
        }
        else {
          res.status(500).send(`
          <html>
            <body>
              <p>The email address is already in use... Redirecting in: <span id="countdown">5</span></p>
              <script src="js/countRedirect.js"></script>
            </body>
          </html>
          `);
        }
      });
    }
    else {
        res.status(500).send(`
        <html>
          <body>
            <p>The username is already in use... Redirecting in: <span id="countdown">5</span></p>
            <script src="js/countRedirect.js"></script>
          </body>
        </html>
        `);
    }
  });
});


appRouter.post('/login', (req, res) => {
  const { emailLogin, passwordLogin } = req.body;
  con.query('SELECT * FROM usercreds WHERE ((email = ? AND password = ?) OR (username = ? AND password = ?))',
  [emailLogin, passwordLogin,emailLogin, passwordLogin], (err, results) => {
      if (err) {
          console.error(err);
          res.status(500).send(`
          <html>
            <body>
              <p>Internal server error... Redirecting in: <span id="countdown">5</span></p>
              <script src="js/other.js"></script>
            </body>
          </html>
          `);
      } else if (results.length == 0) {
          res.status(401).send(`
          <html>
            <body>
              <p>Invalid email or password... Redirecting in: <span id="countdown">5</span></p>
              <script src="js/other.js"></script>
            </body>
          </html>
          `);
      } else {
          res.cookie('accountID', results[0].id);
          res.status(200).send(`
          <html>
            <body>
              <p>Logged in successfully... Redirecting in: <span id="countdown">5</span></p>
              <script src="js/other.js"></script>
            </body>
          </html>
          `);
      }
  });
});




appRouter.post('/mail', (req, res) => {
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yourmindfii@gmail.com',
        pass: 'mfqpnxgrnbecdzhl'
    }
});

const { nameMail, emailMail, textMail } = req.body;

var mailOptions = {
    from: 'yourmindfii@gmail.com',
    to: 'yourmindfii@gmail.com',
    subject: `${nameMail} form contact`,
    html: `<p>From: ${emailMail} <br> Message: ${textMail}</p>`
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log(error);
        res.send('Error sending email');
    } else {
        console.log('Email sent: ' + info.response);
        res.send('Email sent successfully');
    }
});
});


appRouter.post('/logout', (req, res) => {
  const cookies = Object.keys(req.cookies);
  cookies.forEach(cookieName => {
    res.clearCookie(cookieName);
  });
  res.send('Cookies deleted');
});



appRouter.get('/posts', (req, res) => {
  con.query('SELECT * FROM posts ORDER BY creationDate DESC', (err, results) => {
    if (err) {
      throw err;
    }
    res.send(`
      <html>
        <body>
          <h1>Page</h1>
          <ul>
            ${results.map(post => `<li><a href="/posts/${post.id}">${post.title}</a></li>`).join('')}
          </ul>
          <a href="/posts/new">New Post</a>
        </body>
      </html>
    `);
  });
});



appRouter.get('/posts/:id', (req, res) => {
  const postId = req.params.id;
  con.query('SELECT * FROM posts WHERE id = ?', [postId], (err, results) => {
    if (err) {
      throw err;
    }
    const post = results[0];
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
  var querySql;
  if(!req.cookies.accountID){
    querySql = `INSERT INTO userlocs (accountID, latitude, longitude, accuracy, recordingStamp) VALUES (0, ${lat}, ${long}, ${acc}, NOW())`;
  }
  else {
    querySql = `INSERT INTO userlocs (accountID, latitude, longitude, accuracy, recordingStamp) VALUES ('${req.cookies.accountID}', ${lat}, ${long}, ${acc}, NOW())`;
  }
  con.query(querySql, (error, results) => {
    if (error) throw error;
    else {
      console.log('yay');
    }
  });
});


module.exports = appRouter;