
const nodemailer = require('nodemailer');
const fs = require('fs');
const crypto = require('crypto');

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
      res.send({code: 500});
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
          res.send({code: 500});
        } else {
          res.send({code: 200});
        }
      });
    }
  });
});









function jsonAddCode() {
  let genStr = crypto.randomBytes(32).toString('base64');
  genStr = genStr.replace(/[^a-zA-Z0-9]/g, '').substr(0, 64);

  const recoveryStr = {
    generatedString: genStr,
    generatedAt: new Date().toISOString()
  };

  const recFile = JSON.parse(fs.readFileSync('./nodejs/recoveryString.json'));
  recFile.recoveryStrings.push(recoveryStr);
  fs.writeFileSync('./nodejs/recoveryString.json', JSON.stringify(recFile, null, 2));

  return genStr;
}


function recoverPassEmail(recPassEmail) {
  return new Promise((resolve, reject) => {
    const mailTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'yourmindfii@gmail.com',
            pass: 'hysdzhvknlpsbbmw'
        }
    });

    const generatedCode = jsonAddCode();

    let mailDetails = {
        from: 'yourmindfii@gmail.com',
        to: `${recPassEmail}`,
        subject: `[Your Mind] password recovery`,
        html: 
        `<p>Hello there, a request has been made for the recovery of your "Your Mind" account.</p>
        <br>
        <p>Click <a href="http://localhost:3000/recoverPassword/${generatedCode}">this link</a> to continue the steps towards resetting your account's password.</p>
        <br>
        <p>The link is valid for only 30 min, if there is any issue with the link please send another password recovery request.</p>
        <p color="red" font-size="16px">Do not send the link to anyone or you might lose access to your account!</p>`
    };
    
    mailTransport.sendMail(mailDetails, (error, result) => {
        if (error) {
          console.log('[Error]: recoverPassEmail() -> mailTransport.sendmail()');
          console.log(error);
          reject(error);
        } else {
          resolve(200);
        }
      });
  });
}


appRouter.post('/recoverPass', (req, res) => {
  const email = req.body.email;
  const queryRecovery = `SELECT id FROM usercreds WHERE email = ?`;

  con.query(queryRecovery, [email], async (error, resID) => {
    if (error) {
      console.log('[Error]: appRouter.post(/recoverPass) -> con.query(queryRecovery)');
      console.error(error);
      res.send({code: 500});
    }

    if (resID.length == 0) {
      res.send({code: 401});
    }
    else {
      try {
        const resCode = await recoverPassEmail(email);
        if (resCode == 200) {
          res.send({code: 200});
        }
      } catch (error) {
        console.log('[Error]: appRouter.post(/recoverPass) -> recoverPassEmail()');
        console.error(error);
        res.send({code: 402});
      }
    }
  });
});



appRouter.get('/recoverPassword/:Code', (req, res) => {
  const genCode = JSON.stringify(req.params);
  console.log(genCode);

});



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






























appRouter.get('/voteJson', (req, res) => {
});


module.exports = appRouter;