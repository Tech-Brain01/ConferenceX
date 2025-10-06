create database conference_booking;

use conference_booking;

create table users (
id int auto_increment primary key,
name varchar(100),
email varchar(100) unique,
password varchar(255)
);

CREATE TABLE capacities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  capacity INT UNIQUE NOT NULL
);

create table features (
  id int auto_increment primary key,
  name varchar(100) unique not null
);

create table rooms (
id int auto_increment primary key,
name varchar(100),
items text,
capacity int,
available_from date
);

create table bookings (
id int auto_increment primary key,
user_id int,
room_id int,
date date,
foreign key (user_id) references users(id),
foreign key (room_id) references rooms(id)
);

UPDATE rooms
SET items = '["mic", "board"]'
WHERE id = 1;

delete from rooms where id = 1;
delete from rooms where id = 2;

ALTER table rooms add column image varchar(255) default "OIP.webp";

SELECT id, name, image FROM rooms;


select id, name , email , password from users;

delete from users where id in (13);

ALTER TABLE users
ADD COLUMN role VARCHAR(50) DEFAULT 'user';

INSERT INTO users (name, email, password, role) VALUES ('adminuser', 'admin@example.com', '$2a$12$oj7nDS87z.qXQBZg2b7YgORMRv5GGgU12o7C2fKalyFy9jgruW2gm', 'admin');

DESCRIBE rooms;

ALTER TABLE rooms ADD COLUMN capacity_id INT;

ALTER TABLE rooms
ADD CONSTRAINT fk_capacity
FOREIGN KEY (capacity_id) REFERENCES capacities(id);


SELECT rooms.id, rooms.name, capacities.capacity, rooms.available_from
FROM rooms
JOIN capacities ON rooms.capacity_id = capacities.id;

CREATE TABLE room_features_map (
  room_id INT,
  feature_id INT,
  PRIMARY KEY (room_id, feature_id),
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (feature_id) REFERENCES features(id) ON DELETE CASCADE
);


SELECT 
    CONSTRAINT_NAME, 
    COLUMN_NAME, 
    REFERENCED_TABLE_NAME 
FROM 
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE 
    TABLE_NAME = 'bookings' 
    AND CONSTRAINT_SCHEMA = 'conference_booking' 
    AND REFERENCED_TABLE_NAME IS NOT NULL;


ALTER TABLE bookings DROP FOREIGN KEY bookings_ibfk_1;
ALTER TABLE bookings DROP FOREIGN KEY bookings_ibfk_2;

ALTER TABLE bookings
  ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE;

ALTER TABLE bookings ADD COLUMN status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';


ALTER TABLE bookings
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE,
ADD CONSTRAINT fk_room
FOREIGN KEY (room_id) REFERENCES rooms(id)
ON DELETE CASCADE;

INSERT INTO capacities (capacity) VALUES (10), (20), (50) , (80) , (100);

INSERT INTO features (name) VALUES ('Mic'), ('Projector'), ('AC'), ('Smart Board'),('Web'), ('LED Screen'), ('TV'), ('Speakers') , ('Whiteboard') , ('Flipchart') , ('Microphones'), ('Wi-Fi'), ('video Conferencing Facilities') , ('Podium'), ('Stage'), ('Lighting Control'), ('Heating');

select * from users;

delete from users
where id = 17 ;

select * from rooms;

ALTER TABLE bookings
CHANGE COLUMN date start_date DATE;

ALTER TABLE bookings
ADD COLUMN end_date DATE;

ALTER TABLE bookings
ADD COLUMN phone_number varchar(15);

ALTER TABLE bookings
DROP COLUMN email ;

ALTER TABLE bookings
MODIFY COLUMN status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
ADD COLUMN payment_status ENUM('unpaid', 'paid') DEFAULT 'unpaid';

SELECT * FROM bookings;

create table support_message(
  id int auto_increment primary key,
  user_id int not null,
  subject varchar(255) not null,
  message text not null,
  created_at timestamp default current_timestamp,
  foreign key (user_id) references users(id) on delete cascade
);

SELECT * from bookings;

SHOW TABLES;
describe bookings;

describe users;

describe room_features;


-- SHOW CREATE TABLE rooms;
-- SHOW CREATE TABLE bookings;
-- SHOW CREATE TABLE room_features;
-- SHOW CREATE TABLE features;

SHOW CREATE TABLE bookings;

ALTER TABLE bookings DROP FOREIGN KEY bookings_ibfk_2;
ALTER TABLE bookings DROP FOREIGN KEY fk_room;

ALTER TABLE bookings
ADD CONSTRAINT fk_room
FOREIGN KEY (room_id) REFERENCES rooms(id)
ON DELETE CASCADE;

SHOW tables;
describe features;
describe room_features;
describe rooms;


delete from bookings
where id = 4;

select * from bookings;

select * from features;
UPDATE features SET hidden = 0 WHERE id = 6;

SELECT * FROM features ORDER BY name ASC;

select * from capacities;
update capacities set hidden = 0 where id = 26;

SELECT * FROM rooms;

ALTER TABLE rooms
ADD column location varchar(255);

ALTER TABLE rooms
ADD column price decimal(10,2);

alter table rooms
ADD column feedback text;

UPDATE rooms
SET location = 'Ground Floor, Room 3A', price = 1000.00
WHERE id = 17;

Select * from rooms;
UPDATE rooms SET available_from = '2025-09-20' WHERE id = 2;

SHOW FULL COLUMNS FROM rooms;
ALTER TABLE rooms
MODIFY name varchar(100) NOT NULL;



ALTER TABLE bookings
ADD constraint chk_future_date
CHECK (start_date >= curdate());

ALTER TABLE users ADD COLUMN avatar_url VARCHAR(255) NULL;

select * from bookings;

create table support_ticket(
 id int auto_increment primary key,
 user_id int,
 subject varchar(255),
 description text,
 status enum('open', 'pending' , 'resolved') default "open",
 priority enum('low','medium','high') default 'medium' ,
 created_at datetime default  current_timestamp,
 updated_at datetime default current_timestamp on update current_timestamp,
 foreign key (user_id) references users(id)
);


create table ticket_message (
   id int primary key auto_increment,
   ticket_id int,
   sender_id int,
   sender_type enum('user','admin'),
   message text,
   created_at datetime default current_timestamp,
   foreign key (ticket_id) references support_ticket(id)
);

DESCRIBE users;
ALTER TABLE bookings ADD COLUMN booking_ref VARCHAR(50) UNIQUE AFTER id;
ALTER TABLE bookings ADD COLUMN feedback TEXT null,
ADD column reject_response TEXT null;

ALTER TABLE users ADD COLUMN lastLogin timestamp;
ALTER TABLE users ADD COLUMN isrestrict boolean;

DESCRIBE bookings;

DESCRIBE users;


select * from support_ticket;


select * from ticket_message;


select * from bookings;

select * from users;

select * from users;
UPDATE users SET isrestrict = 0 WHERE id = 2;

INSERT INTO users (name, email, password, role) VALUES ('adminuser', 'admin@example.com', '$2a$12$oj7nDS87z.qXQBZg2b7YgORMRv5GGgU12o7C2fKalyFy9jgruW2gm', 'admin');


