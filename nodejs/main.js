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



const genPagesRouter = require('./genPages');
app.use('/', genPagesRouter);
const homePagesRouter = require('./homePages');
app.use('/', homePagesRouter);
const accLogRouter = require('./accLog');
app.use('/', accLogRouter);
const mailJsonRouter = require('./mailJson');
app.use('/', mailJsonRouter);
const otherFunctionsRouter = require('./otherFunctions');
app.use('/', otherFunctionsRouter);
const createPostRouter = require('./createPost');
app.use('/', createPostRouter);
const votePostRouter = require('./votePost');
app.use('/', votePostRouter);



app.use((req, res) => {
  res.status(404).send('404: Page not found');
});



app.listen(3000, () => {
  console.log(`Web server is now live and running on port ${3000}`);
});
