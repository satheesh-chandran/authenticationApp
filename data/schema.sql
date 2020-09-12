DROP TABLE IF EXISTS persons;

CREATE TABLE persons
(
  id NUMERIC (3) NOT NULL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  age NUMERIC (3) NOT NULL,
  houseName VARCHAR(30),
  district VARCHAR(30),
  state VARCHAR(30)
);

INSERT INTO persons
VALUES
  (0, 'satheesh', 21, 'panampilly house', 'thrissur', 'kerala'),
  (1, 'anil', 22, 'elarikkal', 'palakkad', 'kerala'),
  (2, 'thanya', 23, 'cherumanalil', 'kannur', 'kerala'),
  (3, 'sruthy', 24, 'kalarikkal', 'coimbatore', 'thamilnadu');

SELECT * FROM persons;

DROP TABLE IF EXISTS applications;

CREATE TABLE applications 
(
  clientId VARCHAR(50) PRIMARY KEY NOT NULL,
  clientSecret VARCHAR(50) NOT NULL,
  name VARCHAR (30) NOT NULL,
  homePage VARCHAR(30) NOT NULL,
  description VARCHAR(30) NOT NULL,
  redirectUrl VARCHAR (30) NOT NULL
);