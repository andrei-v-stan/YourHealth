const { con } = require('./sql');
const express = require('express');
const appRouter = express.Router();


function handleCounters(conn, postID) {
  conn.query(`SELECT COUNT(*) FROM postlikes WHERE (vote=1 AND postID=${postID})`, (error, resV1) => {
    if (error) {
      console.log('[Error]: appRouter.post.(voteQuery) -> con.query(postlikes WHERE vote=1)');
      console.log(error);
    }
    conn.query(`SELECT COUNT(*) FROM postlikes WHERE (vote=-1 AND postID=${postID})`, (error, resV0) => {
      if (error) {
        console.log('[Error]: appRouter.post.(voteQuery) -> con.query(postlikes WHERE vote=-1)');
        console.log(error);
      }
        const voteCt = parseInt(resV1[0]['COUNT(*)']) - parseInt(resV0[0]['COUNT(*)']);
        conn.query(`UPDATE posts SET voteCount=${voteCt} WHERE id=${postID}`, (error, result) => {
          if (error) {
            console.log('[Error]: appRouter.post.(voteQuery) -> con.query(UPDATE posts SET voteCount)');
            console.log(error);
          }
        });
     });
    });
}


appRouter.post('/votePost', (req, res) => {
  const {postID, vote} = req.body;

  if (!req.cookies.accountID) {
    res.send({code: 401});
  }
  else {
  con.getConnection((err, conn) => {
    if (err) {
      console.log('[Error]: appRouter.get() -> con.getConnection()');
      console.error(err);
      return res.status(500).send(errorHtml);
    }

    conn.beginTransaction(err => {
      if (err) {
        console.log('[Error]: appRouter.get() -> conn.beginTransaction()');
        console.error(err);
        return res.status(500).send(errorHtml);
      }


      conn.query('SELECT vote FROM postlikes WHERE (postID=? AND userID=?)', [postID,req.cookies.accountID], (err, resCheck) => {
        if (err) {
          console.log('[Error]: appRouter.post.(voteQuery) -> con.query(WHERE (postID=? AND userID=?))');
          console.log(error);
        }
        if (resCheck.length == 0) {
          conn.query('INSERT INTO postlikes (`postID`, `userID`, `vote`) VALUES (?,?,?)', [postID,req.cookies.accountID,vote], (error, result) => {
            if (error) {
              console.log('[Error]: appRouter.post.(voteQuery) -> con.query(INSERT INTO postlikes)');
              console.log(error);
            }
            conn.commit(err => {
              if (err) {
                console.log('[Error]: appRouter.get() -> conn.commit() <- For the first commit (conn.query(queryInsertPost))');
                console.error(err);
                return conn.rollback(() => res.status(500).send(errorHtml));
              }
            });
            handleCounters(conn, postID);
          });
        }
        else if (resCheck[0]['vote'] == vote) {
          conn.query(`DELETE FROM postlikes WHERE (postID=? AND userID=?)`, [postID,req.cookies.accountID], (error, result) => {
            if (error) {
              console.log('[Error]: appRouter.post.(voteQuery) -> con.query(DELETE FROM postlikes)');
              console.log(error);
            }
            conn.commit(err => {
              if (err) {
                console.log('[Error]: appRouter.get() -> conn.commit() <- For the first commit (conn.query(queryInsertPost))');
                console.error(err);
                return conn.rollback(() => res.status(500).send(errorHtml));
              }
            });
            handleCounters(conn, postID);
          });
        }
        else {
          con.query(`UPDATE postlikes SET vote=? WHERE (postID=? AND userID=?)`, [vote,postID,req.cookies.accountID], (error, result) => {
            if (error) {
              console.log('[Error]: appRouter.post.(voteQuery) -> con.query(UPDATE postlikes SET vote)');
              console.log(error);
            }
            conn.commit(err => {
              if (err) {
                console.log('[Error]: appRouter.get() -> conn.commit() <- For the first commit (conn.query(queryInsertPost))');
                console.error(err);
                return conn.rollback(() => res.status(500).send(errorHtml));
              }
              handleCounters(conn, postID);
            });
          });
        }
      });

       });
     });
     res.send({code: 200});

    }

});


module.exports = appRouter;