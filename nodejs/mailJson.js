
const fs = require('fs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const { con } = require('./sql');
const express = require('express');
const appRouter = express.Router();



 appRouter.get('/json/addGetID/:id', (req, res) => {
    const accID = req.params.id;
    console.log(accID);
 
    fs.readFile('./nodejs/accData.json', (error, fileData) => {
      if (error) {
        console.log('[Error]: appRouter.get(/json/:accountID) -> fs.readFile(accData.json)');
        console.error(error);
        res.send({code: 500});
      }
  
      let accountDetails = JSON.parse(fileData).accountDetails;
      if (accountDetails.some(obj => obj.accountID == accID)) {
        res.send({code: 200, accID});
      } 
      else {
        accountDetails.push({ accountID: accID, "upVotes": 0, "downVotes": 0 });
        fs.writeFile('./nodejs/accData.json', JSON.stringify({ accountDetails: accountDetails }, null, 2), (error) => {
          if (error) {
            console.log('[Error]: appRouter.post(/save-json/:accountID) -> fs.writeFile(accData.json)');
            console.error(error);
            res.send({code: 500});
          } 
          else {
            res.send({code: 200, accID});
          }
        });
      }
    });
 });
  
  
  
  
  
  
  
  
  
 function jsonRecKeys(recPassEmail) {
    const genBytes = crypto.randomBytes(32);
    let genStr = genBytes.toString('base64');
    genStr = genStr.replace(/[^a-zA-Z0-9]/g, '').substr(0, 64);

    let genDate = new Date();
    genDate = genDate.toLocaleString("en-US", { timeZone: "Europe/Bucharest" });

    const recoveryStr = {
        generatedString: genStr,
        generatedAt: genDate,
        generatedFor: recPassEmail
    };

    const recFile = JSON.parse(fs.readFileSync('./nodejs/recKeys.json'));
    recFile.recoveryPasskeys.push(recoveryStr);
    fs.writeFileSync('./nodejs/recKeys.json', JSON.stringify(recFile, null, 2));

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
  
      const generatedCode = jsonRecKeys(recPassEmail);
  
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
    const passCode = req.params.Code;
    let passCodeEmail = 0;
  
    const recKeysData = JSON.parse(fs.readFileSync('./nodejs/recKeys.json'));
    const currentTime = new Date().getTime();
    let generatedAtTime;
    const minutes = 30;
    
    recKeysData.recoveryPasskeys.forEach((passkey, i) => {
        generatedAtTime = new Date(passkey.generatedAt).getTime();
        if (currentTime - generatedAtTime >= (minutes * 60 * 1000)) {
            recKeysData.recoveryPasskeys.splice(i, 1);
        }
    });
    fs.writeFileSync('./nodejs/recKeys.json', JSON.stringify(recKeysData));
    
    recKeysData.recoveryPasskeys.forEach((passkey, i) => {
        if (passCode == passkey.generatedString) {
            passCodeEmail = passkey.generatedFor;
        }
    });

    if (passCodeEmail != 0) {
        res.render('recoverPassword', { code: passCode, email: passCodeEmail });
    }
    else {
        res.status(401).send(res.render('statusHandler', { statusMessage: 'The link / code is no longer valid' }));
    }
  });
  
  
  
  appRouter.post('/mailContactForm', (req, res) => {
    const mailTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'yourmindfii@gmail.com',
            pass: 'hysdzhvknlpsbbmw'
        }
    });
    
    const { contactName, emailAddr, contactTopic, emailMessage } = req.body;
    
    let mailDetails = {
        from: `${emailAddr}`,
        to: 'yourmindfii@gmail.com',
        subject: `[${contactTopic}]`,
        html: `<p>From: ${contactName}</p> <br>
               <p>Email: ${emailAddr}</p> <br><br>
               <p>Message: ${emailMessage}</p>`
    };
    
    mailTransport.sendMail(mailDetails, (error, result) => {
        if (error) {
          console.log('[Error]: appRouter.post(/mailContactForm) -> mailTransport.sendmail()');
          console.log(error);
          res.send({code: 500});
        } else {
          res.send({code: 200});
        }
      });
    });



    appRouter.post('/changePass', (req, res) => {
        const { password, email, genCode } = req.body;
        const queryUpdatePass = `UPDATE usercreds SET password = ? WHERE (email = ?)`
        
        con.query(queryUpdatePass, [password, email], (error, resID) => {
            if (error) {
            console.log('[Error]: appRouter.post(/changePass) -> con.query(queryUpdatePass)');
            console.error(error);
            res.send({code: 500});
            }
            const recKeysData = JSON.parse(fs.readFileSync('./nodejs/recKeys.json'));
            recKeysData.recoveryPasskeys.forEach((passkey, i) => {
                if (genCode == passkey.generatedString) {
                    recKeysData.recoveryPasskeys.splice(i, 1);
                }
            });
            fs.writeFileSync('./nodejs/recKeys.json', JSON.stringify(recKeysData));
            res.send({code: 200});
        });
    });
  
  

    
appRouter.get('/voteJson', (req, res) => {
});

module.exports = appRouter;