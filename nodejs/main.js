const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const { con } = require('./sql');
const app = express();

app.use(express.static(__dirname + '/../../YourMind'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('views', path.join(__dirname, '../ejs'));
app.set('view engine', 'ejs');



const otherFunctionsRouter = require('./otherFunctions');
app.use('/', otherFunctionsRouter);

const testFunctionsRouter = require('./testFunctions');
app.use('/', testFunctionsRouter);


const createPostRouter = require('./createPost');
app.use('/', createPostRouter);



app.listen(3000, () => {
  console.log(`Web server is now live and running on port ${3000}`);
});
