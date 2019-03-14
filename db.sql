CREATE DATABASE IF NOT EXISTS `krds_poc`;
CREATE TABLE IF NOT EXISTS `krds_poc`.`todo_list` (
ID INT(11) AUTO_INCREMENT PRIMARY KEY,
todo_list TEXT NOT NULL,
status INT(11),
date_created DATETIME,
date_completed DATETIME)
ENGINE = InnoDB;
