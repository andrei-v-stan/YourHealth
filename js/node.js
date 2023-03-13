const express = require('express');
const bodyParser = require('body-parser');
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

app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});