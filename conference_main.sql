-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: conference_booking
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `booking_ref` varchar(50) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `room_id` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('pending','approved','rejected','cancelled') DEFAULT 'pending',
  `end_date` date DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `payment_status` enum('unpaid','paid') DEFAULT 'unpaid',
  `feedback` text,
  `reject_response` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_ref` (`booking_ref`),
  KEY `idx_bookings_user_id` (`user_id`),
  KEY `fk_room` (`room_id`),
  CONSTRAINT `fk_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (6,NULL,20,10,'2025-09-13','2025-09-10 09:42:54','2025-09-12 05:53:07','approved','2025-09-16','0000000','paid',NULL,NULL),(10,NULL,20,10,'2025-09-25','2025-09-15 10:30:15','2025-09-15 11:00:38','cancelled','2025-09-26','22222222','unpaid',NULL,NULL),(11,NULL,20,10,'2025-09-17','2025-09-15 11:03:02','2025-09-15 11:03:12','cancelled','2025-09-20','111111','unpaid',NULL,NULL),(12,NULL,20,10,'2025-10-02','2025-09-19 11:57:27','2025-09-19 11:58:12','cancelled','2025-10-04','01245787845','unpaid',NULL,NULL),(13,NULL,20,10,'2025-12-22','2025-09-19 12:07:27','2025-09-19 12:45:04','approved','2025-12-23','','paid',NULL,NULL),(14,NULL,20,10,'2025-09-23','2025-09-22 12:14:42','2025-09-22 12:33:59','cancelled','2025-09-24','12222222222','unpaid',NULL,NULL),(21,'BK20250922-000021',2,10,'2025-09-24','2025-09-22 12:42:19','2025-09-23 11:51:37','rejected','2025-09-25','55555555','unpaid',NULL,'noooooooooo'),(22,'BK20250922-000022',2,10,'2025-09-29','2025-09-22 12:57:59','2025-09-23 11:51:27','rejected','2025-09-30','55555555','unpaid',NULL,'nooooooo'),(23,'BK20250923-000023',20,26,'2025-09-25','2025-09-23 11:53:00','2025-09-23 12:01:19','rejected','2025-09-30','55555555','unpaid',NULL,'nooooooooooo'),(24,'BK20250923-000024',20,26,'2025-10-02','2025-09-23 11:53:33','2025-09-23 11:54:18','rejected','2025-10-03','55555555','unpaid',NULL,'nooooo'),(25,'BK20250923-000025',20,29,'2025-09-24','2025-09-23 12:27:52','2025-09-23 12:28:42','approved','2025-09-25','55555555','unpaid',NULL,NULL),(26,'BK20250923-000026',20,29,'2025-09-26','2025-09-23 12:29:33','2025-09-24 07:08:13','approved','2025-09-27','55555555','paid',NULL,NULL),(27,'BK20250923-000027',20,29,'2025-09-28','2025-09-23 12:58:54','2025-09-24 05:55:34','approved','2025-09-29','1144774411','unpaid',NULL,NULL),(28,'BK20250924-000028',20,29,'2025-10-01','2025-09-24 05:55:10','2025-09-24 05:55:31','approved','2025-10-02','8888888884','unpaid',NULL,NULL);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `capacities`
--

DROP TABLE IF EXISTS `capacities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `capacities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `capacity` int NOT NULL,
  `hidden` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `capacity` (`capacity`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `capacities`
--

LOCK TABLES `capacities` WRITE;
/*!40000 ALTER TABLE `capacities` DISABLE KEYS */;
INSERT INTO `capacities` VALUES (2,20,0),(3,50,0),(4,80,0),(5,100,0),(9,15,0),(13,25,0),(14,5,0),(23,1,1),(26,2,0),(27,10,0);
/*!40000 ALTER TABLE `capacities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `features`
--

DROP TABLE IF EXISTS `features`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `features` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `hidden` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `features`
--

LOCK TABLES `features` WRITE;
/*!40000 ALTER TABLE `features` DISABLE KEYS */;
INSERT INTO `features` VALUES (2,'Projector',0),(4,'Smart Board',0),(5,'Web',0),(6,'LED Screen',0),(7,'TV',0),(8,'Speakers',0),(9,'Whiteboard',0),(10,'Flipchart',0),(11,'Microphones',0),(12,'Wi-Fi',0),(14,'Podium',0),(15,'Stage',0),(16,'Lighting Control',0),(17,'Heating',0),(20,'mic',0),(22,'Revolving Chair',0),(23,'Ac',0);
/*!40000 ALTER TABLE `features` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_features`
--

DROP TABLE IF EXISTS `room_features`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_features` (
  `room_id` int NOT NULL,
  `feature_id` int NOT NULL,
  PRIMARY KEY (`room_id`,`feature_id`),
  KEY `feature_id` (`feature_id`),
  KEY `idx_room_features_map_room_id` (`room_id`),
  CONSTRAINT `room_features_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `room_features_ibfk_2` FOREIGN KEY (`feature_id`) REFERENCES `features` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_features`
--

LOCK TABLES `room_features` WRITE;
/*!40000 ALTER TABLE `room_features` DISABLE KEYS */;
INSERT INTO `room_features` VALUES (26,4),(10,10),(10,11),(26,14),(29,14),(29,16),(10,20);
/*!40000 ALTER TABLE `room_features` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `available_from` date DEFAULT NULL,
  `image` varchar(255) DEFAULT 'OIP.webp',
  `capacity_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `location` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `feedback` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_room_name` (`name`),
  KEY `idx_rooms_capacity_id` (`capacity_id`),
  CONSTRAINT `fk_capacity` FOREIGN KEY (`capacity_id`) REFERENCES `capacities` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (10,'hall 11','2025-09-12','36513955284de49edb3c154d588cf871',5,'2025-09-04 10:06:46','2025-09-24 07:06:07','Floor 1, Room A',3100.00,NULL),(26,'conference room','2025-09-23','9c4decbd6875b20f5f1e61c4cae950d7',27,'2025-09-22 11:58:11','2025-09-22 11:58:20','cd',3900.00,NULL),(29,'da','2025-09-23','ac01d7f5ecedbb9f48b530b008119abd',27,'2025-09-23 12:27:10','2025-09-23 12:27:10','sfsaf',3900.00,NULL);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `support_ticket`
--

DROP TABLE IF EXISTS `support_ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `support_ticket` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `description` text,
  `status` enum('open','pending','resolved') DEFAULT 'open',
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `support_ticket_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `support_ticket`
--

LOCK TABLES `support_ticket` WRITE;
/*!40000 ALTER TABLE `support_ticket` DISABLE KEYS */;
INSERT INTO `support_ticket` VALUES (1,20,'first',NULL,'resolved','medium','2025-09-22 15:52:30','2025-09-24 12:37:03'),(2,20,'secnsa',NULL,'open','medium','2025-09-22 16:26:45','2025-09-22 16:26:45'),(3,20,'ssasa',NULL,'resolved','medium','2025-09-22 16:49:51','2025-09-22 17:10:21'),(4,20,'rfawr',NULL,'open','medium','2025-09-22 17:17:33','2025-09-22 17:17:33'),(5,20,'sasdada',NULL,'open','medium','2025-09-22 17:18:40','2025-09-22 17:18:40');
/*!40000 ALTER TABLE `support_ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_message`
--

DROP TABLE IF EXISTS `ticket_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ticket_id` int DEFAULT NULL,
  `sender_id` int DEFAULT NULL,
  `sender_type` enum('user','admin') DEFAULT NULL,
  `message` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ticket_id` (`ticket_id`),
  CONSTRAINT `ticket_message_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `support_ticket` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_message`
--

LOCK TABLES `ticket_message` WRITE;
/*!40000 ALTER TABLE `ticket_message` DISABLE KEYS */;
INSERT INTO `ticket_message` VALUES (1,1,20,NULL,'help','2025-09-22 15:52:38'),(2,1,2,NULL,'yes','2025-09-22 16:19:20'),(3,1,20,NULL,'can you','2025-09-22 16:21:14'),(4,1,2,NULL,'no','2025-09-22 16:25:16'),(5,1,20,NULL,'hgj','2025-09-22 16:25:40'),(6,3,20,NULL,'gdsfs','2025-09-22 16:49:55'),(7,2,20,NULL,'dsfdsf','2025-09-22 16:50:00'),(8,2,2,NULL,'gggd','2025-09-22 16:56:16'),(9,3,2,NULL,'sdda','2025-09-22 17:00:19'),(10,1,2,NULL,'uugig','2025-09-22 17:06:54'),(11,1,20,NULL,'fgdfg','2025-09-22 17:14:34'),(12,3,20,NULL,'hhk','2025-09-22 17:14:39'),(13,4,2,NULL,'bcv','2025-09-24 12:37:15');
/*!40000 ALTER TABLE `ticket_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `avatar_url` varchar(255) DEFAULT NULL,
  `lastLogin` timestamp NULL DEFAULT NULL,
  `isrestrict` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'adminuser3','admin@example.com','$2b$10$hQHZQGGkzmdHiQYxZOX3DuRKp7bngRqJ8d03qpm1tb.BAmjqYPPtm','admin','2025-09-04 09:26:19','2025-09-24 13:20:00',NULL,'2025-09-24 13:20:00',0),(19,'amrendera','at@gmail.com','$2b$10$aXNC53WRPdVz1Bl6vdivluUbYBwchldSKvRAcfkxKvIJ/wRn4ehpC','user','2025-09-05 05:19:42','2025-09-05 05:19:42',NULL,NULL,NULL),(20,'aryan','ast@gmail.com','$2b$10$2bIdqaGEzaJEEUrhogsR5uMd9Dn75oprxdjvWMslX1QVRukjrskOa','user','2025-09-05 09:02:13','2025-09-24 13:18:35',NULL,'2025-09-24 13:18:35',0),(21,'aa','aa@gmail.com','$2b$10$uY7PY0yxW6Pjw0AMEHahPeiDksF1SYojivQ7hXI1Szq5D45ODTZKu','user','2025-09-10 10:22:53','2025-09-24 12:25:14',NULL,NULL,0),(25,'shyam','sh@gmail.com','$2b$10$v9dNG8sq7tcWByxrVtLFq.b4MeAWCIIDeMDXgB8OfY.oVfTu1YZHe','user','2025-09-24 11:00:53','2025-09-24 12:25:12',NULL,NULL,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-29 10:09:55
