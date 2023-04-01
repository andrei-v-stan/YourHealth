const { con } = require('./sql');
const express = require('express');
const appRouter = express.Router();


appRouter.post('/create_post', (req, res) => {
  const { titlePost, contentPost, newTag } = req.body;
  const queryInsertPost = `INSERT INTO posts (title, content, authorID, creationDate) VALUES (?, ?, ?, NOW())`;
  const queryGetPostId = `SELECT MAX(id) FROM posts WHERE authorID = ?`
  const queryInsertTags = `INSERT INTO tags (title) SELECT ? WHERE NOT EXISTS (SELECT 1 FROM tags WHERE title = ?);`;
  const queryInsertPostTag = `INSERT INTO tagpostid (postid, tagid) SELECT ?, id FROM tags WHERE title = ?;`;
  
  const errorHtml = `
    <html>
      <body>
        <p>There has been an error trying to create your post... Redirecting in: <span id="countdown">5</span></p>
        <script src="js/other.js"></script>
      </body>
    </html>
    `;

  let noTags = false;
  let foundError = false;
  let postId;
  let newTags;


  if (newTag == undefined) {
    noTags = true;
  }
  else if(Array.isArray(newTag) == true) {
    newTags = Array.from(new Set(newTag));
    newTags = Object.entries(newTags).map(([key, value]) => `${value}`);
  }
  else {
    newTags = new Array(1);
    newTags[0] = newTag;
  }


  if (!req.cookies.accountID) {
    res.status(401).send(`
      <html>
        <body>
          <p>You need to be signed in to create a post... Redirecting in: <span id="countdown">5</span></p>
          <script src="js/other.js"></script>
        </body>
      </html>
    `);
  } else {
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

        conn.query(queryInsertPost, [titlePost, contentPost, req.cookies.accountID], (error, result) => {
          if (error) {
            console.log('[Error]: appRouter.get() -> conn.query(queryInsertPost)');
            console.error(error);
            return conn.rollback(() => res.status(500).send(errorHtml));
          }
          postId = result.insertId;
          conn.commit(err => {
            if (err) {
              console.log('[Error]: appRouter.get() -> conn.commit() <- For the first commit (conn.query(queryInsertPost))');
              console.error(err);
              return conn.rollback(() => res.status(500).send(errorHtml));
            }
          });
        });

        if (noTags == false) {
          conn.query(queryGetPostId, [req.cookies.accountID], (error, result) => {
            if (error) {
              console.log('[Error]: appRouter.get() -> conn.query(queryGetPostId)');
              console.error(error);
              return conn.rollback(() => res.status(500).send(errorHtml));
            }

            postId = result[0]['MAX(id)'];
            for (i=0; i<newTags.length; i++) {
              conn.query(queryInsertTags, [newTags[i], newTags[i]], (error, result) => {
                if (error) {
                  console.log('[Error]: appRouter.get() -> conn.query(queryInsertTags)');
                  console.error(error);
                  return conn.rollback(() => res.status(500).send(errorHtml));
                }
              });
            }

              for (i=0; i<newTags.length; i++) {
                conn.query(queryInsertPostTag, [postId, newTags[i]], (error, result) => {
                  if (error) {
                    console.log('[Error]: appRouter.get() -> conn.query(queryInsertPostTag)');
                    console.error(error);
                    return conn.rollback(() => res.status(500).send(errorHtml));
                  }
                });
              }

              conn.commit(err => {
                if (err) {
                  console.log('[Error]: appRouter.get() -> conn.commit() <- For the second commit (if (noTags == false))');
                  console.error(err);
                  return conn.rollback(() => res.status(500).send(errorHtml));
                }
              });

          });
         }
        });
    });
  }
  res.status(200).redirect('/posts');
});


module.exports = appRouter;