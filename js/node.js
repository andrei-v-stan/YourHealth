const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const { con } = require('./sql');

const app = express();


app.use(express.static(__dirname + '/../../YourMind'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


app.post('/signup', (req, res) => {
    const { username, password, email } = req.body;
    console.log(req.body);
    const sql = `INSERT INTO usercreds (username, password, email) VALUES ('${username}', '${password}', '${email}')`;
    con.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      }
      else {
        console.log(result);
        res.send('Data inserted successfully');
      } 

    });
  });



app.post('/mail', (req, res) => {
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


app.get('/cookies', (req, res) => {
  res.send(Object.entries(req.cookies));
});



app.post('/create_post', (req, res) => {
  const { titlePost, contentPost } = req.body;

  if(!req.cookies.accountID){
    res.status(401).send(`
            <html>
              <body>
                <p>You need to be signed in to create a post... Redirecting in: <span id="countdown">5</span></p>
                <script src="js/other.js"></script>
              </body>
            </html>
            `);
  }
  else {
    con.query('INSERT INTO posts (title, content, authorID, creationDate) VALUES (?, ?, ?, NOW())', [titlePost, contentPost, req.cookies.accountID], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send(`
            <html>
              <body>
                <p>There has been an error while uploading your post... Redirecting in: <span id="countdown">5</span></p>
                <script src="js/other.js"></script>
              </body>
            </html>
            `);
      }
      else {
        res.status(200).redirect('/posts');
      }
    });
  }
});

app.get('/posts', (req, res) => {
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

app.get('/posts/:id', (req, res) => {
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




  app.post('/login', (req, res) => {
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




app.post('/logout', (req, res) => {
  const cookies = Object.keys(req.cookies);
  cookies.forEach(cookieName => {
    res.clearCookie(cookieName);
  });
  res.send('Cookies deleted');
});



app.post('/location', (req, res) => {
  const { lat, long, acc } = req.body;
  var querySql;
  if(!req.cookies.accountID){
    querySql = `INSERT INTO userlocs (accountID, latitude, longitude, accuracy, recordingStamp) VALUES (0, ${lat}, ${long}, ${acc}, NOW())`;
  }
  else {
    querySql = `INSERT INTO userlocs (accountID, latitude, longitude, accuracy, recordingStamp) VALUES (${req.cookies.accountID}, ${lat}, ${long}, ${acc}, NOW())`;
  }
  con.query(querySql, (error, results) => {
    if (error) throw error;
    else {
      console.log('yay');
    }
  });
});




app.listen(3000, () => {
  console.log(`Web server is now live and running on port ${3000}`);
});