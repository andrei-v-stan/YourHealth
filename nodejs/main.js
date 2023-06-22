const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const { con } = require('./sql');
const app = express();

app.use(express.static(__dirname + '/../../YourMind'));
app.set('views', path.join(__dirname, '../ejs'));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());



app.get('/', (req, res) => {
  res.render('index');
});


app.use('/', require('./genPages'));
app.use('/', require('./homeFunctions'));
app.use('/', require('./navbarFunctions'));
app.use('/', require('./sentimentStats'));



app.use((req, res) => {
  res.status(404).render('statusHandler', { statusMessage: 'ERROR 404 - Webpage not found' });
});



app.listen(3000, () => {
  console.log(`Web server is now live and running on port ${3000}`);
});
