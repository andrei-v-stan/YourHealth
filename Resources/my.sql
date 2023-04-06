DROP SCHEMA IF EXISTS mydb;
CREATE SCHEMA IF NOT EXISTS `mydb` ;
USE mydb;

CREATE TABLE IF NOT EXISTS userCreds (
	  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	  username VARCHAR(255) NOT NULL,
	  password VARCHAR(255) NOT NULL,
	  email VARCHAR(255) NOT NULL,
	  creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

INSERT INTO usercreds (`username`, `password`, `email`) VALUES ('', '', '');

CREATE TABLE IF NOT EXISTS userLocs (
  accountID INT NOT NULL,
  FOREIGN KEY (accountID) REFERENCES usercreds(id),
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  latitude TEXT NOT NULL,
  longitude TEXT NOT NULL,
  accuracy TEXT NOT NULL,
  recordingStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS posts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  authorID INT NOT NULL,
  FOREIGN KEY (authorID) REFERENCES usercreds(id),
  voteCount INT DEFAULT 0, 
  creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS postLikes (
  postID INT NOT NULL,
  FOREIGN KEY (postID) REFERENCES posts(id),
  userID INT NOT NULL,
  FOREIGN KEY (userID) REFERENCES usercreds(id),
  vote INT NOT NULL
);

CREATE TABLE IF NOT EXISTS comments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  parentID INT NOT NULL,
  authorID INT NOT NULL,
  FOREIGN KEY (authorID) REFERENCES usercreds(id),
  content TEXT NOT NULL,
  voteCount INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS commentLikes (
  commentID INT NOT NULL PRIMARY KEY,
  FOREIGN KEY (commentID) REFERENCES comments(id),
  commLevel INT NOT NULL,
  userID INT NOT NULL,
  FOREIGN KEY (userID) REFERENCES usercreds(id),
  vote INT NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS tagPostID (
  postID INT NOT NULL,
  FOREIGN KEY (postID) REFERENCES posts(id),
  tagID INT NOT NULL,
  FOREIGN KEY (tagID) REFERENCES tags(id)
);






INSERT INTO usercreds (`username`, `password`, `email`) VALUES ('asd', 'asd123', 'asd@gmail.com');
INSERT INTO posts (`title`, `content`, `authorID`) VALUES ('Post 1', 'Post 1 content', '2');
INSERT INTO tags (`title`) VALUE ('post 1');
INSERT INTO tags (`title`) VALUE ('1 post');
INSERT INTO tagpostid (`postID`, `tagID`) VALUE ('1','1');
INSERT INTO tagpostid (`postID`, `tagID`) VALUE ('1','2');

INSERT INTO usercreds (`username`, `password`, `email`) VALUES ('asd2', 'asd123', 'asd2@gmail.com');
INSERT INTO posts (`title`, `content`, `authorID`) VALUES ('Post 2', 'Post 2 content', '3');
INSERT INTO tags (`title`) VALUE ('post 2');
INSERT INTO tags (`title`) VALUE ('2 post');
INSERT INTO tagpostid (`postID`, `tagID`) VALUE ('2','3');
INSERT INTO tagpostid (`postID`, `tagID`) VALUE ('2','4');

INSERT INTO posts (`title`, `content`, `authorID`) VALUES ('Post 3', 'Post 3 content', '3');
INSERT INTO tags (`title`) VALUE ('post 3');
INSERT INTO tagpostid (`postID`, `tagID`) VALUE ('3','5');
INSERT INTO tagpostid (`postID`, `tagID`) VALUE ('3','2');

INSERT INTO posts (`title`, `content`, `authorID`) VALUES ('Post 4', 'Post 4 content', '2');

INSERT INTO posts (`title`, `content`, `authorID`) VALUES ('Post 5', 'Post 5 content', '2');
INSERT INTO tagpostid (`postID`, `tagID`) VALUE ('5','5');
INSERT INTO tagpostid (`postID`, `tagID`) VALUE ('5','2');
INSERT INTO tagpostid (`postID`, `tagID`) VALUE ('5','1');