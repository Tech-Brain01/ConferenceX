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
  `start_time` time DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `approved_at` datetime DEFAULT NULL,
  `status` enum('pending','approved','rejected','cancelled') DEFAULT 'pending',
  `end_date` date DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT '0.00',
  `tax` decimal(10,2) DEFAULT '0.00',
  `total_amount` decimal(10,2) GENERATED ALWAYS AS ((`amount` + `tax`)) STORED,
  `payment_status` enum('unpaid','paid') DEFAULT 'unpaid',
  `payment_method` enum('cash','credit_card','UPI','bank_transfer') DEFAULT 'UPI',
  `transaction_ref` varchar(100) DEFAULT NULL,
  `invoice_no` varchar(50) DEFAULT NULL,
  `payment_date` datetime DEFAULT NULL,
  `feedback` text,
  `reject_response` text,
  `rating` tinyint unsigned DEFAULT NULL COMMENT 'Rating from 1 to 5',
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_ref` (`booking_ref`),
  KEY `idx_bookings_user_id` (`user_id`),
  KEY `fk_room` (`room_id`),
  CONSTRAINT `fk_room` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` (`id`, `booking_ref`, `user_id`, `room_id`, `start_date`, `start_time`, `created_at`, `updated_at`, `approved_at`, `status`, `end_date`, `end_time`, `phone_number`, `amount`, `tax`, `payment_status`, `payment_method`, `transaction_ref`, `invoice_no`, `payment_date`, `feedback`, `reject_response`, `rating`) VALUES (21,'BK20250922-000021',2,10,'2025-09-24','08:40:46','2025-09-22 12:42:19','2025-11-04 05:39:16',NULL,'cancelled','2025-09-25','11:47:48','55555555',0.00,0.00,'unpaid','UPI',NULL,NULL,NULL,NULL,'noooooooooo',NULL),(22,'BK20250922-000022',2,10,'2025-09-29','13:41:15','2025-09-22 12:57:59','2025-11-04 05:39:16',NULL,'cancelled','2025-09-30','15:38:17','55555555',0.00,0.00,'unpaid','UPI',NULL,NULL,NULL,NULL,'nooooooo',NULL),(23,'BK20250923-000023',20,26,'2025-09-25','14:23:59','2025-09-23 11:53:00','2025-11-04 05:39:16',NULL,'rejected','2025-09-30','16:48:02','55555555',0.00,0.00,'unpaid','UPI',NULL,NULL,NULL,NULL,'nooooooooooo',NULL),(25,'BK20250923-000025',20,29,'2025-09-24','12:56:10','2025-09-23 12:27:52','2025-11-04 05:31:23','2025-09-23 18:02:52','approved','2025-09-25','15:05:19','55555555',7800.00,1404.00,'paid','UPI','TRX-000025','INV-000025','2025-09-24 01:52:09','good experience',NULL,2),(26,'BK20250923-000026',20,29,'2025-09-26','13:28:54','2025-09-23 12:29:33','2025-11-04 05:31:23','2025-09-23 18:04:33','approved','2025-09-27','16:02:32','55555555',7800.00,1404.00,'paid','UPI','TRX-000026','INV-000026','2025-09-26 03:19:08','nice experience',NULL,NULL),(27,'BK20250923-000027',20,29,'2025-09-28','10:36:01','2025-09-23 12:58:54','2025-11-04 05:31:23','2025-09-23 18:33:54','approved','2025-09-29','12:56:44','1144774411',7800.00,1404.00,'paid','UPI','TRX-000027','INV-000027','2025-09-28 17:15:05',NULL,NULL,NULL),(39,'BK20250930-000039',2,26,'2025-10-02','14:33:24','2025-09-30 12:41:08','2025-11-04 05:31:23','2025-09-30 18:16:08','approved','2025-10-03','17:36:05','5555555555',7800.00,1404.00,'paid','UPI','TRX-000039','INV-000039','2025-10-02 16:14:05',NULL,'noooooo',NULL),(40,'BK20251007-000040',20,10,'2025-10-02','12:58:58','2025-10-07 06:48:14','2025-11-04 07:11:10','2025-10-07 12:23:14','approved','2025-10-05','14:10:17','1111111111',12400.00,2232.00,'paid','UPI','TRX-000040','INV-000040','2025-10-02 16:13:04','awesomeeeee',NULL,NULL),(41,'BK20251007-000041',20,26,'2025-10-08','13:14:36','2025-10-07 06:48:44','2025-11-04 05:39:16',NULL,'cancelled','2025-10-09','15:03:06','2222222222',0.00,0.00,'unpaid','UPI',NULL,NULL,NULL,NULL,'not available',NULL),(42,'BK20251007-000042',20,29,'2025-10-24','09:16:06','2025-10-07 06:49:04','2025-11-04 05:31:23','2025-10-07 12:24:04','approved','2025-10-25','10:44:41','5555555555',7800.00,1404.00,'paid','UPI','TRX-000042','INV-000042','2025-10-24 15:01:13',NULL,NULL,NULL),(43,'BK20251010-000043',2,10,'2025-11-01','08:36:44','2025-10-10 05:00:01','2025-11-04 05:39:16',NULL,'approved','2025-11-03','12:34:07','5555555555',0.00,0.00,'unpaid','UPI',NULL,NULL,NULL,NULL,NULL,NULL),(44,'BK20251010-000044',2,29,'2025-11-01','17:15:21','2025-10-10 05:00:26','2025-11-04 05:39:16',NULL,'approved','2025-11-04','19:36:34','7777777777',0.00,0.00,'unpaid','UPI',NULL,NULL,NULL,NULL,NULL,NULL),(45,'BK20251010-000045',2,26,'2025-11-09','12:26:33','2025-10-10 05:00:48','2025-11-04 05:39:16',NULL,'approved','2025-11-11','14:20:28','3333333333',0.00,0.00,'unpaid','UPI',NULL,NULL,NULL,NULL,NULL,NULL),(3046,'BK20250801-000001',19,10,'2025-08-01','12:26:45','2025-07-24 18:30:00','2025-11-04 05:31:23','2025-07-25 00:05:00','approved','2025-08-02','13:52:40','5551234567',6200.00,310.00,'paid','UPI','TRX-003046','INV-003046','2025-08-01 23:18:33',NULL,NULL,NULL),(3047,'BK20250801-000002',20,26,'2025-08-01','16:54:04','2025-07-24 18:30:00','2025-11-04 05:31:23','2025-07-25 00:05:00','approved','2025-08-02','20:21:55','5559876543',7800.00,1404.00,'paid','UPI','TRX-003047','INV-003047','2025-08-01 21:42:53','Well maintained',NULL,2),(3048,'BK20250801-000003',21,29,'2025-08-01','09:10:07','2025-07-24 18:30:00','2025-11-04 06:42:25','2025-07-25 00:05:00','approved','2025-08-02','12:11:40','5551234567',7800.00,1404.00,'paid','UPI','TRX-003048','INV-003048','2025-08-01 09:11:50','Well maintained',NULL,4),(3051,'BK20250802-000006',27,51,'2025-08-02','11:32:58','2025-07-25 18:30:00','2025-11-04 05:31:23','2025-07-26 00:05:00','approved','2025-08-03','15:21:42','5555556666',1400.00,70.00,'paid','UPI','TRX-003051','INV-003051','2025-08-02 15:43:38','Well maintained',NULL,3),(3052,'BK20250802-000007',28,52,'2025-08-02','09:09:57','2025-07-25 18:30:00','2025-11-04 06:03:51','2025-07-26 00:05:00','approved','2025-08-03','10:24:54','5557778888',2200.00,110.00,'paid','UPI','TRX-003052','INV-003052','2025-08-02 00:09:47','Nice venue','',2),(3053,'BK20250803-000008',29,10,'2025-08-03','13:10:51','2025-07-26 18:30:00','2025-11-04 05:31:23','2025-07-27 00:05:00','approved','2025-08-04','15:59:23','5559990000',6200.00,310.00,'paid','UPI','TRX-003053','INV-003053','2025-08-03 10:48:46',NULL,NULL,NULL),(3055,'BK20250803-000010',31,29,'2025-08-03','14:29:25','2025-07-26 18:30:00','2025-11-04 06:05:46',NULL,'rejected','2025-08-04','15:32:54','5554445555',0.00,0.00,'unpaid','UPI',NULL,NULL,NULL,NULL,'error ',NULL),(3056,'BK20250803-000011',32,45,'2025-08-03','13:13:56','2025-07-26 18:30:00','2025-11-04 05:31:23','2025-07-27 00:05:00','approved','2025-08-04','16:37:54','5556667777',7600.00,1368.00,'paid','UPI','TRX-003056','INV-003056','2025-08-03 09:45:31','Well maintained',NULL,1),(3057,'BK20250804-000012',19,50,'2025-08-04','14:41:24','2025-07-27 18:30:00','2025-11-04 06:07:20',NULL,'cancelled','2025-08-05','18:30:50','5551234567',0.00,0.00,'unpaid','UPI',NULL,NULL,NULL,NULL,NULL,NULL),(3058,'BK20250804-000013',20,51,'2025-08-04','15:45:12','2025-07-27 18:30:00','2025-11-04 05:31:23','2025-07-28 00:05:00','approved','2025-08-05','17:40:28','5559876543',1400.00,70.00,'paid','UPI','TRX-003058','INV-003058','2025-08-04 09:22:42','average room',NULL,2),(3059,'BK20250804-000014',21,52,'2025-08-04','16:41:49','2025-07-27 18:30:00','2025-11-04 05:39:16',NULL,'rejected','2025-08-05','19:49:52','5551234567',0.00,0.00,'unpaid','UPI',NULL,NULL,NULL,NULL,'Double booking',NULL),(3060,'BK20250805-000015',25,10,'2025-08-05','08:13:28','2025-07-28 18:30:00','2025-11-04 06:07:20','2025-07-29 00:05:00','approved','2025-08-06','11:07:55','5551112222',6200.00,310.00,'paid','UPI','TRX-003060','INV-003060','2025-08-05 10:58:35','Spacious room','',2),(3061,'BK20250805-000016',26,26,'2025-08-05','13:01:56','2025-07-28 18:30:00','2025-11-04 06:07:57','2025-07-29 00:05:00','approved','2025-08-06','14:10:03','5553334444',7800.00,1404.00,'paid','UPI','TRX-003061','INV-003061','2025-08-05 00:19:36','Spacious room','',5),(3062,'BK20250805-000017',27,29,'2025-08-05','12:29:18','2025-07-28 18:30:00','2025-11-04 06:09:25','2025-07-29 00:05:00','approved','2025-08-06','14:26:31','5555556666',7800.00,1404.00,'paid','UPI','TRX-003062','INV-003062','2025-08-05 00:21:40','Nice venue',NULL,5),(3063,'BK20250805-000018',28,45,'2025-08-05','15:20:40','2025-07-28 18:30:00','2025-11-04 05:31:23','2025-07-29 00:05:00','approved','2025-08-06','17:42:26','5557778888',7600.00,1368.00,'paid','UPI','TRX-003063','INV-003063','2025-08-05 07:28:28','Good experience',NULL,1),(3065,'BK20250806-000020',30,51,'2025-08-06','12:15:12','2025-07-29 18:30:00','2025-11-04 06:09:25','2025-07-30 00:05:00','approved','2025-08-07','13:55:42','5550009999',1400.00,70.00,'paid','UPI','TRX-003065','INV-003065','2025-08-06 22:17:36','Well maintained',NULL,5),(3086,'BK20251025-000301',25,52,'2025-10-25','09:29:44','2025-10-17 18:30:00','2025-11-04 06:09:25',NULL,'cancelled','2025-10-26','11:00:48','5551112222',0.00,0.00,'unpaid','UPI',NULL,NULL,NULL,NULL,NULL,NULL),(3087,'BK20251026-000302',26,10,'2025-10-26','12:43:01','2025-10-18 18:30:00','2025-11-04 05:31:23','2025-10-19 00:05:00','approved','2025-10-27','14:16:52','5553334444',6200.00,310.00,'paid','UPI','TRX-003087','INV-003087','2025-10-26 04:02:41','Good experience',NULL,4),(3088,'BK20251026-000303',27,26,'2025-10-26','17:05:57','2025-10-18 18:30:00','2025-11-04 06:10:17','2025-10-19 00:05:00','approved','2025-10-27','19:21:59','5555556666',7800.00,1404.00,'paid','UPI','TRX-003088','INV-003088','2025-10-26 07:27:25','Spacious room',NULL,4),(3089,'BK20251026-000304',28,29,'2025-10-26','09:20:40','2025-10-18 18:30:00','2025-11-04 06:10:17','2025-10-19 00:05:00','approved','2025-10-27','11:59:19','5557778888',7800.00,1404.00,'paid','UPI','TRX-003089','INV-003089','2025-10-26 16:11:54','Well maintained','',1),(3090,'BK20251026-000305',29,45,'2025-10-26','17:25:32','2025-10-18 18:30:00','2025-11-04 05:31:23','2025-10-19 00:05:00','approved','2025-10-27','19:50:40','5559990000',7600.00,1368.00,'paid','UPI','TRX-003090','INV-003090','2025-10-26 23:04:31','Spacious room',NULL,4),(3092,'BK20251027-000307',31,51,'2025-10-27','15:11:46','2025-10-19 18:30:00','2025-11-04 06:15:26','2025-10-20 00:05:00','approved','2025-10-28','16:45:11','5554445555',1400.00,70.00,'paid','UPI','TRX-003092','INV-003092','2025-10-27 08:12:58',NULL,NULL,NULL),(3093,'BK20251027-000308',32,52,'2025-10-27','14:41:47','2025-10-19 18:30:00','2025-11-04 05:31:23','2025-10-20 00:05:00','approved','2025-10-28','17:59:34','5556667777',2200.00,110.00,'paid','UPI','TRX-003093','INV-003093','2025-10-27 06:30:37','Good experience',NULL,5),(3094,'BK20251028-000309',19,10,'2025-10-28','09:53:40','2025-10-20 18:30:00','2025-11-04 05:31:23','2025-10-21 00:05:00','approved','2025-10-29','11:42:23','5551234567',6200.00,310.00,'paid','UPI','TRX-003094','INV-003094','2025-10-28 15:24:01',NULL,NULL,NULL),(3095,'BK20251028-000310',20,26,'2025-10-28','17:22:58','2025-10-20 18:30:00','2025-11-04 05:31:23','2025-10-21 00:05:00','approved','2025-10-29','18:33:10','5559876543',7800.00,1404.00,'paid','UPI','TRX-003095','INV-003095','2025-10-28 22:38:20','Spacious room',NULL,4),(3097,'BK20251028-000312',25,45,'2025-10-28','16:00:22','2025-10-20 18:30:00','2025-11-04 05:31:23','2025-10-21 00:05:00','approved','2025-10-29','17:34:05','5551112222',7600.00,1368.00,'paid','UPI','TRX-003097','INV-003097','2025-10-28 18:54:10','Good experience',NULL,2),(3099,'BK20251029-000314',27,51,'2025-10-29','15:40:26','2025-10-21 18:30:00','2025-11-04 06:19:21',NULL,'cancelled','2025-10-30','16:49:17','5555556666',0.00,0.00,'unpaid','UPI',NULL,NULL,NULL,NULL,NULL,NULL),(3101,'BK20251030-000316',29,10,'2025-10-30','11:44:49','2025-10-22 18:30:00','2025-11-04 05:31:23','2025-10-23 00:05:00','approved','2025-10-31','13:29:42','5559990000',6200.00,310.00,'paid','UPI','TRX-003101','INV-003101','2025-10-30 03:12:36','Well maintained',NULL,1),(3102,'BK20251030-000317',30,26,'2025-10-30','08:40:26','2025-10-22 18:30:00','2025-11-04 06:20:45',NULL,'cancelled','2025-10-31','10:18:00','5550009999',0.00,0.00,'unpaid','UPI',NULL,NULL,NULL,NULL,NULL,NULL),(3105,'BK20251027-003105',20,50,'2025-10-27','14:44:10','2025-10-27 11:32:29','2025-11-04 05:31:23','2025-10-27 17:07:29','approved','2025-10-28','16:50:14','5555555555',2400.00,120.00,'paid','UPI','TRX-003105','INV-003105','2025-11-04 11:01:23',NULL,NULL,NULL),(3106,'BK20251027-003106',20,50,'2025-10-31','15:48:24','2025-10-27 11:32:43','2025-11-04 05:31:23','2025-10-27 17:07:43','approved','2025-11-01','17:39:24','5555555555',2400.00,120.00,'paid','UPI','TRX-003106','INV-003106','2025-10-31 10:21:29','baaddddd',NULL,NULL),(3107,'BK20251029-003107',20,52,'2025-12-01','16:49:31','2025-10-29 09:26:01','2025-11-04 05:31:23','2025-10-29 15:01:01','approved','2025-12-05','18:46:22','1111111111',5500.00,275.00,'paid','UPI','TXN-1762234283-812','INV-1762234283-982','2025-11-04 11:01:23',NULL,NULL,NULL),(3108,'BK20251029-003108',20,50,'2025-11-14','08:42:24','2025-10-29 10:01:13','2025-11-04 05:31:23','2025-10-29 15:36:13','approved','2025-11-15','11:53:38','1111111111',2400.00,120.00,'paid','UPI','TXN-1762234283-474','INV-1762234283-426','2025-11-04 11:01:23',NULL,NULL,NULL),(3110,'BK20251030-003110',20,26,'2025-11-03','12:15:00','2025-10-30 07:05:26','2025-11-04 06:41:30','2025-10-30 12:40:26','approved','2025-11-03','12:46:00','0000000000',3900.00,195.00,'paid','UPI','TXN-1762234283-708','INV-1762234283-264','2025-11-04 11:01:23','nice',NULL,1),(3114,'BK20251030-003114',20,26,'2025-11-07','08:00:00','2025-10-30 07:30:13','2025-11-03 06:41:17',NULL,'cancelled','2025-11-07','14:00:00','2222222222',0.00,0.00,'unpaid','UPI',NULL,NULL,NULL,NULL,NULL,NULL),(3115,'BK20251030-003115',20,26,'2025-11-05','11:45:00','2025-10-30 07:47:32','2025-11-03 06:41:14',NULL,'cancelled','2025-11-05','19:49:00','5555555555',0.00,0.00,'unpaid','UPI',NULL,NULL,NULL,NULL,NULL,NULL),(3116,'BK20251103-003116',20,29,'2025-11-24','14:30:00','2025-11-03 11:26:14','2025-11-04 05:39:16',NULL,'rejected','2025-11-25','22:27:00','5555555555',0.00,0.00,'unpaid','UPI',NULL,NULL,NULL,NULL,'Payment window expired (2 hours)',NULL),(3117,'BK20251103-003117',20,29,'2025-11-24','05:30:00','2025-11-03 11:33:08','2025-11-04 05:31:23','2025-11-03 17:04:35','approved','2025-11-25','05:30:00','5555555555',7800.00,1404.00,'paid','UPI','TXN-1762234283-195','INV-1762234283-184','2025-11-04 11:01:23',NULL,NULL,NULL),(3118,'BK20251103-003118',20,52,'2025-12-15','07:00:00','2025-11-03 12:29:05','2025-11-04 05:31:23','2025-11-03 17:59:30','approved','2025-12-24','23:30:00','5555555555',11000.00,1980.00,'paid','UPI','TXN-1762173131048-929','INV-1762173131048-592','2025-11-03 18:02:11',NULL,NULL,NULL),(3120,'BK20251104-003120',20,50,'2025-12-01','14:30:00','2025-11-04 04:54:08','2025-11-04 04:55:28','2025-11-04 10:24:43','approved','2025-12-10','16:01:00','5555555555',12000.00,2160.00,'paid','UPI','TXN-1762232128193-417','INV-1762232128193-235','2025-11-04 10:25:28',NULL,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `capacities`
--

LOCK TABLES `capacities` WRITE;
/*!40000 ALTER TABLE `capacities` DISABLE KEYS */;
INSERT INTO `capacities` VALUES (2,20,0),(3,50,0),(4,80,0),(5,100,0),(9,15,0),(13,25,0),(14,5,0),(23,1,1),(26,2,0),(27,10,0),(29,30,0);
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
INSERT INTO `room_features` VALUES (45,2),(26,4),(45,4),(50,4),(51,4),(52,4),(45,5),(45,6),(50,6),(52,6),(45,7),(51,7),(45,8),(45,9),(10,10),(45,10),(10,11),(45,11),(51,11),(45,12),(26,14),(29,14),(45,14),(50,14),(51,14),(52,14),(45,15),(29,16),(45,17),(10,20),(45,20),(45,22),(50,22),(45,23),(50,23),(52,23);
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
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (10,'hall 11','2025-09-12','36513955284de49edb3c154d588cf871',5,'2025-09-04 10:06:46','2025-09-24 07:06:07','Floor 1, Room A',3100.00,NULL),(26,'conference room','2025-09-23','c8598cd8387db109a97979ab74fa0c5c',27,'2025-09-22 11:58:11','2025-10-16 05:46:40','cd',3900.00,NULL),(29,'da','2025-09-23','ac01d7f5ecedbb9f48b530b008119abd',27,'2025-09-23 12:27:10','2025-09-23 12:27:10','sfsaf',3900.00,NULL),(45,'hall 1','2025-10-15','7ae4a323819bcdd0cba94b884a29f69b',3,'2025-10-15 12:07:32','2025-10-16 05:46:27','Room A, Floor 2nd, Administrative Block',3800.00,NULL),(50,'hall 2','2025-10-16','2d73dc11e6ea3b5f3c23592dcaabc0c1',29,'2025-10-16 05:44:43','2025-10-16 05:44:43','Floor 1, Room B4',1200.00,NULL),(51,'hall 3','2025-10-24','c8eaf3b4657e2400c4c8431021781c38',4,'2025-10-16 05:45:19','2025-10-16 05:45:19','Floor 2, Room B5',700.00,NULL),(52,'Hall 4','2025-10-24','05abc77279ac77319eb70b6cfea72638',9,'2025-10-16 05:46:07','2025-10-16 05:46:07','Floor 2, Room F5',1100.00,NULL);
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
INSERT INTO `support_ticket` VALUES (1,20,'first',NULL,'resolved','medium','2025-09-22 15:52:30','2025-09-24 12:37:03'),(2,20,'secnsa',NULL,'pending','medium','2025-09-22 16:26:45','2025-10-27 18:29:03'),(3,20,'ssasa',NULL,'resolved','medium','2025-09-22 16:49:51','2025-09-22 17:10:21'),(4,20,'rfawr',NULL,'open','medium','2025-09-22 17:17:33','2025-09-22 17:17:33'),(5,20,'sasdada',NULL,'open','medium','2025-09-22 17:18:40','2025-09-22 17:18:40');
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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'adminuser3','admin@example.com','$2b$10$hQHZQGGkzmdHiQYxZOX3DuRKp7bngRqJ8d03qpm1tb.BAmjqYPPtm','admin','2025-09-04 09:26:19','2025-11-04 05:40:53',NULL,'2025-11-04 05:40:53',0),(19,'amrendera','at@gmail.com','$2b$10$aXNC53WRPdVz1Bl6vdivluUbYBwchldSKvRAcfkxKvIJ/wRn4ehpC','user','2025-09-05 05:19:42','2025-09-05 05:19:42',NULL,NULL,NULL),(20,'aryan','ast@gmail.com','$2b$10$2bIdqaGEzaJEEUrhogsR5uMd9Dn75oprxdjvWMslX1QVRukjrskOa','user','2025-09-05 09:02:13','2025-11-04 06:49:32',NULL,'2025-11-04 06:49:32',0),(21,'aa','aa@gmail.com','$2b$10$uY7PY0yxW6Pjw0AMEHahPeiDksF1SYojivQ7hXI1Szq5D45ODTZKu','user','2025-09-10 10:22:53','2025-09-24 12:25:14',NULL,NULL,0),(25,'shyam','sh@gmail.com','$2b$10$v9dNG8sq7tcWByxrVtLFq.b4MeAWCIIDeMDXgB8OfY.oVfTu1YZHe','user','2025-09-24 11:00:53','2025-09-24 12:25:12',NULL,NULL,0),(26,'user1','user1@gamil.com','$2b$10$FLPplof.l9kSfchDrH9r7.wd.cJGQaACH9S0cv.M.imxLD52BcUOq','user','2025-09-30 09:45:06','2025-09-30 11:31:14',NULL,'2025-09-30 11:31:14',NULL),(27,'user2','user2@gamil.com','$2b$10$z4sWlsg3ulnBVyVkgLAI4eAfPWPDW/bC79W/Ag.ZAEKM/f5aFtIm6','user','2025-09-30 09:46:29','2025-09-30 09:48:50',NULL,'2025-09-30 09:48:50',NULL),(28,'John Doe','john@example.com','$2b$10$abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijab','user','2025-08-01 04:30:00','2025-08-01 04:30:00',NULL,'2025-08-10 02:30:00',0),(29,'Jane Smith','jane@example.com','$2b$10$abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijab','user','2025-08-02 04:00:00','2025-08-10 04:00:00',NULL,'2025-08-15 06:15:00',0),(30,'Alice','alice@example.com','$2b$10$abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijab','admin','2025-08-05 02:40:00','2025-08-20 06:30:00',NULL,'2025-09-10 08:30:00',0),(31,'Bob','bob@example.com','$2b$10$abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijab','user','2025-08-10 08:45:00','2025-09-05 03:30:00',NULL,'2025-09-07 04:30:00',0),(32,'Charlie','charlie@example.com','$2b$10$abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijab','user','2025-09-01 06:15:00','2025-10-10 03:00:00',NULL,'2025-10-10 03:00:00',0),(34,'a           ','f@d.com','$2b$10$iJC59wHGIelgro5JYDh9W.Qtcf5KQNR3mp2DVCqNMrLAJA3bLphVW','user','2025-10-29 11:40:52','2025-10-29 11:40:52',NULL,NULL,NULL);
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

-- Dump completed on 2025-11-04 13:00:10
