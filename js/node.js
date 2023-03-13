const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
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



app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});