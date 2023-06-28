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

CREATE TABLE IF NOT EXISTS userLocs (
  logNumber INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  accountID INT NOT NULL,
  FOREIGN KEY (accountID) REFERENCES usercreds(id),
  latitude FLOAT DEFAULT 0.0,
  longitude FLOAT DEFAULT 0.0,,
  accuracy FLOAT DEFAULT 0.0,,
  recordingStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS posts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  authorID INT NOT NULL,
  FOREIGN KEY (authorID) REFERENCES usercreds(id),
  voteCount INT DEFAULT 0, 
  commentCount INT DEFAULT 0,
  sentimentScore FLOAT DEFAULT 0.0,
  sentimentMagnitude FLOAT DEFAULT 0.0,
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
  postID INT NOT NULL,
  FOREIGN KEY (postID) REFERENCES posts(id),
  parentID INT NOT NULL,
  parentType VARCHAR(10) NOT NULL,
  authorID INT NOT NULL,
  FOREIGN KEY (authorID) REFERENCES usercreds(id),
  content TEXT NOT NULL,
  voteCount INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS commentLikes (
  commentID INT NOT NULL PRIMARY KEY,
  FOREIGN KEY (commentID) REFERENCES comments(id),
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

CREATE TABLE IF NOT EXISTS userDetails (
  userID INT NOT NULL PRIMARY KEY,
  FOREIGN KEY (userID) REFERENCES usercreds (id),
  displayName VARCHAR(255),
  username VARCHAR(255),
  clearance FLOAT DEFAULT 1,
  title VARCHAR(255) NOT NULL, 
  birthDate DATE,
  bioData TEXT,
  avgSentimentScore FLOAT DEFAULT 0.0000000000,
  avgSentimentMagnitude FLOAT DEFAULT 0.00000000000
);
/*
  Admin - 10
  Mod - 9
  International government services ( UN / ICAO) - 8
  Higher government services (FBI / CIA) - 7
  Supreme / International Courthouses - 6
  Local Courthouses - 5
  Police officer / Investigators / Government Offices - 4
  Medical Practitioner / Researcher - 3 
  Social Aider - 2
  Regular User - 1
*/


CREATE TABLE IF NOT EXISTS bookmarkedPosts (
  postID INT NOT NULL,
  FOREIGN KEY (postID) REFERENCES posts(id),
  userID INT NOT NULL,
  FOREIGN KEY (userID) REFERENCES usercreds(id)
);

CREATE TABLE IF NOT EXISTS hiddenPosts (
  postID INT NOT NULL,
  FOREIGN KEY (postID) REFERENCES posts(id),
  userID INT NOT NULL,
  FOREIGN KEY (userID) REFERENCES usercreds(id)
);

CREATE TABLE IF NOT EXISTS viewedPosts (
  postID INT NOT NULL,
  FOREIGN KEY (postID) REFERENCES posts(id),
  userID INT NOT NULL,
  FOREIGN KEY (userID) REFERENCES usercreds(id)
);

