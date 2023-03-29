USE mydb;

CREATE TABLE IF NOT EXISTS userCreds (
	  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	  username VARCHAR(255) NOT NULL,
	  password VARCHAR(255) NOT NULL,
	  email VARCHAR(255) NOT NULL,
	  creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

INSERT INTO usercreds (`username`, `password`, `email`) VALUES ('', '', '');
UPDATE usercreds SET id = 0 WHERE id = 1;

CREATE TABLE IF NOT EXISTS posts (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  authorID INT NOT NULL,
  FOREIGN KEY (authorID) REFERENCES usercreds(id),
  creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS userlocs (
  accountID INT NOT NULL,
  FOREIGN KEY (accountID) REFERENCES usercreds(id),
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  latitude TEXT NOT NULL,
  longitude TEXT NOT NULL,
  accuracy TEXT NOT NULL,
  recordingStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tags (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS tagpostid (
  postid INT NOT NULL,
  FOREIGN KEY (postid) REFERENCES posts(id),
  tagid INT NOT NULL,
  FOREIGN KEY (tagid) REFERENCES tags(id)
);