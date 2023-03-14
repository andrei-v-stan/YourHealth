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



app.post('/create_post', (req, res) => {
  const { titlePost, contentPost, authorPost } = req.body;

  con.query('INSERT INTO posts (title, content, author, created_at) VALUES (?, ?, ?, NOW())', [titlePost, contentPost, authorPost], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error creating post');
    } else {
      res.redirect('/posts');
    }
  });
});

app.get('/posts', (req, res) => {
  con.query('SELECT * FROM posts ORDER BY created_at DESC', (err, results) => {
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
          <h1>${post.author}</h1>
          <p>${post.content}</p>
        </body>
        </html>
      `);
    });
  });




  app.use(cookieParser());
  app.post('/login', (req, res) => {
    const { emailLogin, passwordLogin } = req.body;

    con.query('SELECT * FROM usercreds WHERE email = ? AND password = ?', [emailLogin, passwordLogin], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal server error');
        } else if (results.length == 0) {
            res.status(401).send('Invalid email or password');
        } else {
            const accountId = results[0].id;
            res.cookie('account_id', accountId);
            res.send('Logged in successfully');
        }
    });
});





app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});