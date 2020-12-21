CREATE TABLE IF NOT EXISTS TV_SHOW  (
	  id INT AUTO_INCREMENT  PRIMARY KEY,
	  name VARCHAR(250) NOT NULL,
	  summary VARCHAR(2048),
	  artwork VARCHAR(250),
	  thumbnail VARCHAR(250),
	  url VARCHAR(250),
	  unique(name)
	);

