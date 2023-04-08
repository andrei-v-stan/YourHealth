
const nodemailer = require('nodemailer');
const fs = require('fs');

const { con } = require('./sql');
const express = require('express');
const appRouter = express.Router();


appRouter.post('/mail', (req, res) => {
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yourmindfii@gmail.com',
        pass: 'hysdzhvknlpsbbmw'
    }
});

const { nameMail, emailMail, textMail } = req.body;

let mailDetails = {
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


appRouter.post('/location', (req, res) => {
  const { lat, long, acc } = req.body;
  let queryLocation;
  let accID;

  if(!req.cookies.accountID)  {
    accID = 1;
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


appRouter.get('/json/:accountID', (req, res) => {
  const accountID = JSON.stringify(req.params);
  let accountDetails = [];

  fs.readFile('./nodejs/accData.json', (error, fileData) => {
    if (error) {
      console.log('[Error]: appRouter.get(/json/:accountID) -> fs.readFile(accData.json)');
      console.error(error);
      res.status(500).send(res.render('statusHandler', { statusMessage: 'There has been an internal server error' }));
    } 
    else {
      const strFileData = fileData.toString();
      if (strFileData) {
        accountDetails = JSON.parse(strFileData).accountDetails;
      }
      accountDetails.push({ accountID: req.params.accountID });

      fs.writeFile('./nodejs/accData.json', JSON.stringify({ accountDetails: accountDetails }, null, 2), (error) => {
        if (error) {
          console.log('[Error]: appRouter.post(/save-json/:accountID) -> fs.writeFile(accData.json)');
          console.error(error);
          res.status(500).send(res.render('statusHandler', { statusMessage: 'There has been an internal server error' }));
        } else {
          res.status(200).send(res.render('statusHandler', { statusMessage: 'Account created successfully' }));
        }
      });
    }
  });
});



appRouter.get('/voteJson', (req, res) => {
});


module.exports = appRouter;