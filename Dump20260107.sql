-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: studentactivity
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `attendance_id` int unsigned NOT NULL AUTO_INCREMENT,
  `student_id` int unsigned NOT NULL,
  `faculty_id` int unsigned NOT NULL,
  `venue_id` int unsigned NOT NULL,
  `session_id` int unsigned NOT NULL,
  `is_present` tinyint(1) NOT NULL DEFAULT '0',
  `is_late` tinyint(1) NOT NULL DEFAULT '0',
  `remarks` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`attendance_id`),
  KEY `student_id` (`student_id`),
  KEY `faculty_id` (`faculty_id`),
  KEY `venue_id` (`venue_id`),
  KEY `session_id` (`session_id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`faculty_id`) ON DELETE CASCADE,
  CONSTRAINT `attendance_ibfk_3` FOREIGN KEY (`venue_id`) REFERENCES `venue` (`venue_id`) ON DELETE CASCADE,
  CONSTRAINT `attendance_ibfk_4` FOREIGN KEY (`session_id`) REFERENCES `attendance_session` (`session_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (1,8,12,1,15,1,0,NULL,'2026-01-05 12:17:30',NULL),(2,9,12,1,15,0,0,NULL,'2026-01-05 12:17:30',NULL),(3,10,12,1,15,0,1,'went to ps','2026-01-05 12:17:30',NULL),(4,11,12,1,15,0,0,NULL,'2026-01-05 12:17:30',NULL),(5,12,12,1,15,1,0,NULL,'2026-01-05 12:17:30',NULL),(6,8,12,1,18,1,0,NULL,'2026-01-06 11:40:36',NULL),(7,9,12,1,18,1,0,NULL,'2026-01-06 11:40:36',NULL),(8,10,12,1,18,1,0,NULL,'2026-01-06 11:40:36',NULL),(9,11,12,1,18,1,0,NULL,'2026-01-06 11:40:36',NULL),(10,12,12,1,18,1,0,NULL,'2026-01-06 11:40:36',NULL),(11,8,1,1,20,1,0,NULL,'2026-01-06 15:01:17',NULL),(12,9,1,1,20,1,0,NULL,'2026-01-06 15:01:17',NULL),(13,10,1,1,20,1,0,NULL,'2026-01-06 15:01:17',NULL),(14,11,1,1,20,1,0,NULL,'2026-01-06 15:01:17',NULL),(15,12,1,1,20,1,0,NULL,'2026-01-06 15:01:17',NULL),(16,1,1,8,22,1,0,NULL,'2026-01-06 20:55:12','2026-01-06 20:55:25'),(17,26,1,8,22,1,0,NULL,'2026-01-06 20:55:12','2026-01-06 20:55:25'),(18,8,12,1,23,0,0,NULL,'2026-01-06 21:59:12',NULL),(19,9,12,1,23,0,1,NULL,'2026-01-06 21:59:12',NULL),(20,10,12,1,23,1,0,NULL,'2026-01-06 21:59:12',NULL),(21,11,12,1,23,1,0,NULL,'2026-01-06 21:59:12',NULL),(22,12,12,1,23,0,0,NULL,'2026-01-06 21:59:12',NULL);
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance_session`
--

DROP TABLE IF EXISTS `attendance_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_session` (
  `session_id` int unsigned NOT NULL AUTO_INCREMENT,
  `session_name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_session`
--

LOCK TABLES `attendance_session` WRITE;
/*!40000 ALTER TABLE `attendance_session` DISABLE KEYS */;
INSERT INTO `attendance_session` VALUES (15,'AI__Machine_Learning_Lab_Hemanth_SV_20260105_2026-01-05_09:00_AM_-_10:30_AM','2026-01-05 12:17:12'),(16,'AI__Machine_Learning_Lab_2026-01-05_Morning','2026-01-05 16:20:23'),(17,'AI__Machine_Learning_Lab_Vikram_S_20260105_2026-01-05_09:00_AM_-_10:30_AM','2026-01-05 21:24:09'),(18,'AI__Machine_Learning_Lab_Hemanth_SV_20260106_2026-01-06_09:00_AM_-_10:30_AM','2026-01-06 08:51:37'),(19,'AI__Machine_Learning_Lab_Hemanth_SV_20260106_2026-01-06_09:00_AM_-_10:30_AM','2026-01-06 08:51:37'),(20,'AI__Machine_Learning_Lab_Vikram_S_20260106_2026-01-06_09:00_AM_-_10:30_AM','2026-01-06 11:10:42'),(21,'Cyber_Security_Lab_Vikram_S_20260106_2026-01-06_09:00_AM_-_10:30_AM','2026-01-06 11:46:41'),(22,'Blockchain_Lab_Vikram_S_20260106_2026-01-06_09:00_AM_-_10:30_AM','2026-01-06 20:55:02'),(23,'AI__Machine_Learning_Lab_Hemanth_SV_20260106_2026-01-06_10:30_AM_-_12:30_PM','2026-01-06 21:58:10'),(24,'AI__Machine_Learning_Lab_Hemanth_SV_20260106_2026-01-06_01:30_PM_-_03:00_PM','2026-01-06 21:59:19'),(25,'AI__Machine_Learning_Lab_Hemanth_SV_20260106_2026-01-06_03:00_PM_-_04:30_PM','2026-01-06 21:59:28');
/*!40000 ALTER TABLE `attendance_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faculties`
--

DROP TABLE IF EXISTS `faculties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculties` (
  `faculty_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `designation` varchar(255) NOT NULL,
  PRIMARY KEY (`faculty_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `faculties_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faculties`
--

LOCK TABLES `faculties` WRITE;
/*!40000 ALTER TABLE `faculties` DISABLE KEYS */;
INSERT INTO `faculties` VALUES (1,2,'Assistant Professor'),(2,3,'Associate Professor'),(3,4,'Assistant Professor'),(4,5,'Assistant Professor'),(5,6,'Associate Professor'),(6,7,'Assistant Professor'),(7,8,'Professor'),(8,9,'Assistant Professor'),(9,10,'Associate Professor'),(10,11,'Assistant Professor'),(11,37,'Professor'),(12,1,'Administrator'),(13,38,'Faculty');
/*!40000 ALTER TABLE `faculties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_students`
--

DROP TABLE IF EXISTS `group_students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_students` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `group_id` int unsigned NOT NULL,
  `student_id` int unsigned NOT NULL,
  `allocation_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('Active','Dropped','Completed') NOT NULL DEFAULT 'Active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_group_student` (`group_id`,`student_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `group_students_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE,
  CONSTRAINT `group_students_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_students`
--

LOCK TABLES `group_students` WRITE;
/*!40000 ALTER TABLE `group_students` DISABLE KEYS */;
INSERT INTO `group_students` VALUES (1,2,8,'2025-12-27 11:18:29','Active'),(2,2,9,'2025-12-27 11:18:29','Active'),(3,2,10,'2025-12-27 11:18:29','Active'),(4,2,11,'2025-12-27 11:18:29','Active'),(5,2,12,'2025-12-27 11:18:29','Active'),(6,5,26,'2026-01-06 10:26:31','Active'),(7,5,1,'2026-01-06 15:45:49','Active');
/*!40000 ALTER TABLE `group_students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups` (
  `group_id` int unsigned NOT NULL AUTO_INCREMENT,
  `group_code` varchar(50) NOT NULL,
  `group_name` varchar(255) NOT NULL,
  `venue_id` int unsigned NOT NULL,
  `faculty_id` int unsigned NOT NULL,
  `schedule_days` varchar(100) NOT NULL,
  `schedule_time` varchar(100) NOT NULL,
  `max_students` int NOT NULL DEFAULT '50',
  `department` varchar(255) NOT NULL,
  `status` enum('Active','Inactive','Review') NOT NULL DEFAULT 'Active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`group_id`),
  UNIQUE KEY `group_code` (`group_code`),
  KEY `venue_id` (`venue_id`),
  KEY `faculty_id` (`faculty_id`),
  CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`venue_id`) REFERENCES `venue` (`venue_id`) ON DELETE RESTRICT,
  CONSTRAINT `groups_ibfk_2` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`faculty_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES (1,'CS-WEB-24','Web Development Workshop',2,1,'Mon, Wed','10:00 AM - 12:00 PM',60,'Computer Science','Active','2025-12-27 10:17:21'),(2,'AL-ML-24','Machine Learning Bootcamp',1,2,'Tue, Thu','2:00 PM - 4:00 PM',120,'Artificial Intelligence','Active','2025-12-27 10:17:21'),(3,'AD-DATA-23','Data Science Workshop',4,4,'Mon, Wed, Fri','9:00 AM - 11:00 AM',50,'Artificial & Data Science','Active','2025-12-27 10:17:21'),(4,'EC-IOT-23','IoT Development',3,3,'Tue, Thu','11:00 AM - 1:00 PM',80,'Electronics','Active','2025-12-27 10:17:21'),(5,'VENUE-8','Blockchain Lab',8,11,'Mon, Wed','10:00 - 12:00',100,'General','Active','2026-01-06 09:56:54');
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mapping_history`
--

DROP TABLE IF EXISTS `mapping_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mapping_history` (
  `history_id` int unsigned NOT NULL AUTO_INCREMENT,
  `student_id` int unsigned NOT NULL,
  `faculty_id` int unsigned NOT NULL,
  `venue_id` int unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`history_id`),
  KEY `student_id` (`student_id`),
  KEY `faculty_id` (`faculty_id`),
  KEY `venue_id` (`venue_id`),
  CONSTRAINT `mapping_history_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `mapping_history_ibfk_2` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`faculty_id`) ON DELETE CASCADE,
  CONSTRAINT `mapping_history_ibfk_3` FOREIGN KEY (`venue_id`) REFERENCES `venue` (`venue_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mapping_history`
--

LOCK TABLES `mapping_history` WRITE;
/*!40000 ALTER TABLE `mapping_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `mapping_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resources`
--

DROP TABLE IF EXISTS `resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resources` (
  `resource_id` int unsigned NOT NULL AUTO_INCREMENT,
  `venloc_id` int unsigned NOT NULL,
  `resource_type` varchar(255) NOT NULL,
  `resource_upload` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`resource_id`),
  KEY `venloc_id` (`venloc_id`),
  CONSTRAINT `resources_ibfk_1` FOREIGN KEY (`venloc_id`) REFERENCES `venue_allocation` (`venloc_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resources`
--

LOCK TABLES `resources` WRITE;
/*!40000 ALTER TABLE `resources` DISABLE KEYS */;
/*!40000 ALTER TABLE `resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roadmap`
--

DROP TABLE IF EXISTS `roadmap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roadmap` (
  `roadmap_id` int unsigned NOT NULL AUTO_INCREMENT,
  `venue_id` int unsigned NOT NULL,
  `faculty_id` int unsigned NOT NULL,
  `day` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `status` enum('draft','editing','published') NOT NULL DEFAULT 'draft',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`roadmap_id`),
  KEY `faculty_id` (`faculty_id`),
  KEY `idx_venue` (`venue_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `roadmap_ibfk_1` FOREIGN KEY (`venue_id`) REFERENCES `venue` (`venue_id`) ON DELETE CASCADE,
  CONSTRAINT `roadmap_ibfk_2` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`faculty_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roadmap`
--

LOCK TABLES `roadmap` WRITE;
/*!40000 ALTER TABLE `roadmap` DISABLE KEYS */;
INSERT INTO `roadmap` VALUES (1,1,1,1,'React Fundamentals & JSX','Introduction to React, understanding JSX, and creating your first components.  Learn about virtual DOM and React ecosystem.','published','2025-12-27 15:35:07','2025-12-27 15:35:07'),(2,1,1,2,'Components & Props','Deep dive into React components, props, and component composition. Understanding functional vs class components.','published','2025-12-27 15:35:07','2025-12-27 15:35:07'),(3,1,1,3,'State & Lifecycle','Learn about component state, lifecycle methods, and hooks. Build interactive components. ','published','2025-12-27 15:35:07','2025-12-27 15:35:07'),(4,1,1,4,'Event Handling','Master event handling in React.  Learn about synthetic events and best practices.','draft','2025-12-27 15:35:07','2025-12-27 15:35:07'),(5,2,1,1,'HTML5 Semantic Elements','Learn about modern HTML5 semantic tags and their importance in web development.','published','2025-12-27 15:35:07','2025-12-27 15:35:07'),(6,2,1,2,'CSS Grid & Flexbox','Master modern CSS layout techniques using Grid and Flexbox. ','published','2025-12-27 15:35:07','2025-12-27 15:35:07'),(7,2,1,3,'Responsive Design','Learn how to create responsive layouts that work on all devices.','draft','2025-12-27 15:35:07','2025-12-27 15:35:07'),(9,8,1,1,'Blockchain Lab - Day 1','paduchutu vada','published','2026-01-06 11:55:22','2026-01-06 15:48:14');
/*!40000 ALTER TABLE `roadmap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roadmap_resources`
--

DROP TABLE IF EXISTS `roadmap_resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roadmap_resources` (
  `resource_id` int unsigned NOT NULL AUTO_INCREMENT,
  `roadmap_id` int unsigned NOT NULL,
  `resource_name` varchar(255) NOT NULL,
  `resource_type` enum('pdf','video','link') NOT NULL,
  `resource_url` text,
  `file_path` varchar(500) DEFAULT NULL,
  `file_size` bigint DEFAULT NULL,
  `uploaded_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`resource_id`),
  KEY `idx_roadmap` (`roadmap_id`),
  CONSTRAINT `roadmap_resources_ibfk_1` FOREIGN KEY (`roadmap_id`) REFERENCES `roadmap` (`roadmap_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roadmap_resources`
--

LOCK TABLES `roadmap_resources` WRITE;
/*!40000 ALTER TABLE `roadmap_resources` DISABLE KEYS */;
INSERT INTO `roadmap_resources` VALUES (1,1,'React Official Documentation','link','https://react.dev/learn',NULL,NULL,'2025-12-27 15:35:07'),(2,1,'JSX In Depth Tutorial','video','https://www.youtube.com/watch?v=7fPXI_MnBOY',NULL,NULL,'2025-12-27 15:35:07'),(3,2,'Components Guide','link','https://react.dev/learn/your-first-component',NULL,NULL,'2025-12-27 15:35:07'),(4,2,'Props vs State Video','video','https://www.youtube.com/watch?v=IYvD9oBCuJI',NULL,NULL,'2025-12-27 15:35:07'),(5,3,'React Hooks Documentation','link','https://react.dev/reference/react',NULL,NULL,'2025-12-27 15:35:07'),(6,5,'HTML5 Cheatsheet','link','https://developer.mozilla.org/en-US/docs/Web/HTML',NULL,NULL,'2025-12-27 15:35:07'),(7,5,'Semantic HTML Video','video','https://www.youtube.com/watch?v=kGW8Al_cga4',NULL,NULL,'2025-12-27 15:35:07'),(8,6,'CSS Grid Guide','link','https://css-tricks.com/snippets/css/complete-guide-grid/',NULL,NULL,'2025-12-27 15:35:07'),(9,6,'Flexbox Tutorial','video','https://www.youtube.com/watch?v=JJSoEo8JSnc',NULL,NULL,'2025-12-27 15:35:07'),(12,4,'1000037272','pdf',NULL,'uploads\\roadmap\\1767686643922-854890565.pdf',903619,'2026-01-06 13:34:03'),(13,9,'SRP - S4 -Problem Statement.xlsx - Software','pdf',NULL,'uploads\\roadmap\\1767694684481-110926390.pdf',204874,'2026-01-06 15:48:04');
/*!40000 ALTER TABLE `roadmap_resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `role_id` int unsigned NOT NULL AUTO_INCREMENT,
  `role` varchar(255) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'admin'),(2,'faculty'),(3,'student');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skills` (
  `skill_id` int unsigned NOT NULL AUTO_INCREMENT,
  `skill_name` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`skill_id`),
  UNIQUE KEY `skill_name` (`skill_name`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES (1,'Python Programming','2025-12-27 10:17:21'),(2,'JavaScript','2025-12-27 10:17:21'),(3,'React','2025-12-27 10:17:21'),(4,'Node.js','2025-12-27 10:17:21'),(5,'SQL Database','2025-12-27 10:17:21'),(6,'HTML/CSS','2025-12-27 10:17:21'),(7,'Java','2025-12-27 10:17:21'),(8,'C++','2025-12-27 10:17:21'),(9,'Machine Learning','2025-12-27 10:17:21'),(10,'Data Structures','2025-12-27 10:17:21'),(11,'Web Development','2025-12-27 10:17:21'),(12,'Mobile Development','2025-12-27 10:17:21'),(13,'Cloud Computing','2025-12-27 10:17:21'),(14,'DevOps','2025-12-27 10:17:21'),(15,'UI/UX Design','2025-12-27 10:17:21'),(16,'Data Analytics','2025-12-27 10:17:21'),(17,'Artificial Intelligence','2025-12-27 10:17:21'),(18,'Cyber Security','2025-12-27 10:17:21'),(19,'IoT','2025-12-27 10:17:21'),(20,'Blockchain','2025-12-27 10:17:21');
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_report`
--

DROP TABLE IF EXISTS `student_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_report` (
  `report_id` int unsigned NOT NULL AUTO_INCREMENT,
  `faculty_id` int unsigned NOT NULL,
  `student_id` int unsigned NOT NULL,
  `venue_id` int unsigned NOT NULL,
  `task_type` varchar(255) NOT NULL,
  `task_upload` varchar(255) NOT NULL,
  `rating` decimal(3,1) DEFAULT NULL,
  `comment` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`report_id`),
  KEY `faculty_id` (`faculty_id`),
  KEY `student_id` (`student_id`),
  KEY `venue_id` (`venue_id`),
  CONSTRAINT `student_report_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`faculty_id`) ON DELETE CASCADE,
  CONSTRAINT `student_report_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `student_report_ibfk_3` FOREIGN KEY (`venue_id`) REFERENCES `venue` (`venue_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_report`
--

LOCK TABLES `student_report` WRITE;
/*!40000 ALTER TABLE `student_report` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_skills`
--

DROP TABLE IF EXISTS `student_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_skills` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `student_id` int unsigned NOT NULL,
  `skill_id` int unsigned NOT NULL,
  `proficiency_level` enum('Beginner','Intermediate','Advanced','Expert') NOT NULL DEFAULT 'Beginner',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_skill` (`student_id`,`skill_id`),
  KEY `skill_id` (`skill_id`),
  CONSTRAINT `student_skills_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `student_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_skills`
--

LOCK TABLES `student_skills` WRITE;
/*!40000 ALTER TABLE `student_skills` DISABLE KEYS */;
/*!40000 ALTER TABLE `student_skills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `student_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `year` int NOT NULL,
  `semester` int NOT NULL,
  `assigned_faculty_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `assigned_faculty_id` (`assigned_faculty_id`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `students_ibfk_2` FOREIGN KEY (`assigned_faculty_id`) REFERENCES `faculties` (`faculty_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,12,2,4,1),(2,13,2,4,2),(3,14,2,4,3),(4,15,2,4,1),(5,16,2,4,2),(6,17,2,4,3),(7,18,2,4,4),(8,19,2,4,5),(9,20,2,4,1),(10,21,2,4,6),(11,22,2,4,7),(12,23,2,4,2),(13,24,2,4,8),(14,25,2,4,3),(15,26,2,4,9),(16,27,2,4,1),(17,28,2,4,10),(18,29,2,4,4),(19,30,2,4,5),(20,31,2,4,2),(21,32,2,4,6),(22,33,2,4,7),(23,34,2,4,8),(24,35,2,4,9),(25,36,2,4,10),(26,39,2,4,11);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_files`
--

DROP TABLE IF EXISTS `task_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_files` (
  `file_id` int unsigned NOT NULL AUTO_INCREMENT,
  `task_id` int unsigned NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `file_size` bigint DEFAULT NULL,
  `uploaded_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`file_id`),
  KEY `task_id` (`task_id`),
  CONSTRAINT `task_files_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_files`
--

LOCK TABLES `task_files` WRITE;
/*!40000 ALTER TABLE `task_files` DISABLE KEYS */;
INSERT INTO `task_files` VALUES (1,3,'Redux_Tutorial.pdf','uploads/tasks/1703001234567-redux. pdf','application/pdf',2048576,'2025-12-27 15:09:29'),(2,3,'State_Management_Guide.pdf','uploads/tasks/1703001234568-state.pdf','application/pdf',1536000,'2025-12-27 15:09:29'),(3,9,'TrailBlazer1.jpeg','uploads\\tasks\\1766980029650-669356105.jpeg','image/jpeg',144505,'2025-12-29 09:17:09'),(4,10,'SIH PPT FINAL.pdf','uploads\\tasks\\1767610075930-963305686.pdf','application/pdf',1000150,'2026-01-05 16:17:55'),(5,11,'TrailBlazer2.jpg','uploads\\tasks\\1767677549595-595624082.jpg','image/jpeg',140432,'2026-01-06 11:02:29');
/*!40000 ALTER TABLE `task_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_submissions`
--

DROP TABLE IF EXISTS `task_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_submissions` (
  `submission_id` int unsigned NOT NULL AUTO_INCREMENT,
  `task_id` int unsigned NOT NULL,
  `student_id` int unsigned NOT NULL,
  `submitted_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `file_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `status` enum('Pending Review','Graded','Needs Revision') NOT NULL DEFAULT 'Pending Review',
  `grade` int DEFAULT NULL,
  `feedback` text,
  `is_late` tinyint(1) DEFAULT '0',
  `graded_at` datetime DEFAULT NULL,
  `graded_by` int unsigned DEFAULT NULL,
  PRIMARY KEY (`submission_id`),
  KEY `task_id` (`task_id`),
  KEY `student_id` (`student_id`),
  KEY `graded_by` (`graded_by`),
  CONSTRAINT `task_submissions_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`) ON DELETE CASCADE,
  CONSTRAINT `task_submissions_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  CONSTRAINT `task_submissions_ibfk_3` FOREIGN KEY (`graded_by`) REFERENCES `faculties` (`faculty_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_submissions`
--

LOCK TABLES `task_submissions` WRITE;
/*!40000 ALTER TABLE `task_submissions` DISABLE KEYS */;
INSERT INTO `task_submissions` VALUES (1,1,1,'2024-12-28 10:30:00',NULL,NULL,'Graded',85,NULL,0,'2024-12-29 14:20:00',1),(2,1,2,'2024-12-28 15:45:00',NULL,NULL,'Graded',92,NULL,0,'2025-12-27 18:09:21',1),(3,1,3,'2024-12-29 09:15:00',NULL,NULL,'Pending Review',NULL,NULL,0,NULL,NULL),(4,1,4,'2024-12-28 08:20:00',NULL,NULL,'Needs Revision',45,NULL,0,'2024-12-29 14:30:00',1),(5,1,5,'2025-12-27 15:09:29',NULL,NULL,'Pending Review',NULL,NULL,0,NULL,NULL),(6,2,1,'2025-12-27 15:09:29',NULL,NULL,'Pending Review',NULL,NULL,0,NULL,NULL),(7,2,2,'2024-12-20 11:30:00',NULL,NULL,'Graded',88,NULL,0,'2024-12-21 10:00:00',1),(8,2,3,'2025-12-27 15:09:29',NULL,NULL,'Pending Review',NULL,NULL,0,NULL,NULL),(9,2,4,'2025-12-27 15:09:29',NULL,NULL,'Pending Review',NULL,NULL,0,NULL,NULL),(10,2,5,'2024-12-19 14:45:00',NULL,NULL,'Graded',95,NULL,0,'2024-12-21 10:05:00',1),(11,3,1,'2025-12-27 15:09:29',NULL,NULL,'Pending Review',NULL,NULL,0,NULL,NULL),(12,3,2,'2025-12-27 15:09:29',NULL,NULL,'Pending Review',NULL,NULL,0,NULL,NULL),(13,3,3,'2025-12-27 15:09:29',NULL,NULL,'Pending Review',NULL,NULL,0,NULL,NULL),(14,3,4,'2025-12-27 15:09:29',NULL,NULL,'Pending Review',NULL,NULL,0,NULL,NULL),(15,3,5,'2025-12-27 15:09:29',NULL,NULL,'Pending Review',NULL,NULL,0,NULL,NULL),(22,1,1,'2024-12-28 10:30:00',NULL,NULL,'Graded',85,NULL,0,'2024-12-29 14:20:00',1),(23,1,2,'2024-12-28 15:45:00',NULL,NULL,'Graded',92,NULL,0,'2024-12-29 14:25:00',1),(24,1,3,'2024-12-29 09:15:00',NULL,NULL,'Pending Review',NULL,NULL,0,NULL,NULL),(25,1,4,'2024-12-28 08:20:00',NULL,NULL,'Needs Revision',45,NULL,0,'2024-12-29 14:30:00',1),(26,1,5,'2025-12-27 15:37:54',NULL,NULL,'Needs Revision',49,NULL,0,'2025-12-27 18:09:09',1),(27,2,1,'2025-12-27 15:37:54',NULL,NULL,'Pending Review',NULL,NULL,0,NULL,NULL),(28,2,2,'2024-12-20 11:30:00',NULL,NULL,'Graded',88,NULL,0,'2024-12-21 10:00:00',1),(29,2,3,'2025-12-27 15:37:54',NULL,NULL,'Pending Review',NULL,NULL,0,NULL,NULL),(30,9,8,'2025-12-29 09:17:09',NULL,NULL,'Pending Review',NULL,NULL,0,NULL,NULL),(31,9,9,'2025-12-29 09:17:09',NULL,NULL,'Pending Review',NULL,NULL,0,NULL,NULL),(32,9,10,'2025-12-29 09:17:09',NULL,NULL,'Pending Review',NULL,NULL,0,NULL,NULL),(33,9,11,'2025-12-29 09:17:09',NULL,NULL,'Pending Review',NULL,NULL,0,NULL,NULL),(34,9,12,'2025-12-29 09:17:09',NULL,NULL,'Pending Review',NULL,NULL,0,NULL,NULL),(35,10,8,'2026-01-05 16:17:56',NULL,NULL,'Graded',50,NULL,0,'2026-01-06 11:44:28',1),(36,10,9,'2026-01-05 16:17:56',NULL,NULL,'Needs Revision',49,NULL,0,'2026-01-06 11:44:32',1),(37,10,10,'2026-01-05 16:17:56',NULL,NULL,'Graded',100,NULL,0,'2026-01-06 11:44:36',1),(38,10,11,'2026-01-05 16:17:56',NULL,NULL,'Pending Review',NULL,NULL,0,NULL,NULL),(39,10,12,'2026-01-05 16:17:56',NULL,NULL,'Pending Review',NULL,NULL,0,NULL,NULL),(40,11,26,'2026-01-06 11:02:29',NULL,NULL,'Needs Revision',0,NULL,0,'2026-01-06 20:36:57',2),(41,11,1,'2026-01-06 20:36:21','Link Submission','https://react.dev/','Pending Review',NULL,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `task_submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `task_id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `venue_id` int unsigned NOT NULL,
  `faculty_id` int unsigned NOT NULL,
  `day` int NOT NULL,
  `due_date` date DEFAULT NULL,
  `max_score` int NOT NULL DEFAULT '100',
  `material_type` enum('link','file') DEFAULT 'link',
  `external_url` text,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`task_id`),
  KEY `venue_id` (`venue_id`),
  KEY `faculty_id` (`faculty_id`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`venue_id`) REFERENCES `venue` (`venue_id`) ON DELETE CASCADE,
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`faculty_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,'React Hooks Implementation','Learn and implement React Hooks including useState, useEffect, and custom hooks.  Build a todo app using hooks.',1,1,1,'2024-12-30',100,'link','https://react. dev/learn/hooks','Active','2025-12-27 15:09:29','2025-12-27 15:09:29'),(2,'Component Lifecycle Quiz','Test your understanding of React component lifecycle methods and hooks. Complete the online quiz. ',1,1,3,'2025-01-05',50,'link','https://reactquiz.com','Active','2025-12-27 15:09:29','2025-12-27 15:09:29'),(3,'State Management Exercise','Implement Redux or Context API for state management in a medium-sized React application. ',1,1,5,'2024-12-12',75,'file',NULL,'Inactive','2025-12-27 15:09:29','2025-12-27 15:09:29'),(4,'CSS Grid Layout Project','Create a responsive layout using CSS Grid. Must work on mobile, tablet, and desktop.',2,1,1,'2025-01-01',100,'link','https://css-tricks.com/snippets/css/complete-guide-grid/','Active','2025-12-27 15:09:29','2025-12-27 15:09:29'),(5,'HTML Semantic Tags Exercise','Build a complete webpage using only semantic HTML5 tags. No divs allowed! ',2,1,2,'2024-12-25',50,'link','https://developer.mozilla.org/en-US/docs/Web/HTML/Element','Active','2025-12-27 15:09:29','2025-12-27 15:09:29'),(6,'React Hooks Implementation','Learn and implement React Hooks including useState, useEffect, and custom hooks.  Build a todo app using hooks.',1,1,1,'2024-12-30',100,'link','https://react.dev/learn/hooks','Active','2025-12-27 15:37:54','2025-12-27 15:37:54'),(7,'Component Lifecycle Quiz','Test your understanding of React component lifecycle methods and hooks. Complete the online quiz.',1,1,3,'2025-01-05',50,'link','https://reactquiz.com','Active','2025-12-27 15:37:54','2025-12-27 15:37:54'),(8,'CSS Grid Layout Project','Create a responsive layout using CSS Grid. Must work on mobile, tablet, and desktop.',1,1,1,'2025-01-01',100,'link','https://css-tricks.com/snippets/css/complete-guide-grid/','Active','2025-12-27 15:37:54','2025-12-27 15:37:54'),(9,'Node Js','Learn The Fundamentals.',1,1,3,'2026-01-05',100,'file',NULL,'Active','2025-12-29 09:17:09','2025-12-29 09:17:09'),(10,'FullStack','Fuck You !!!',1,1,3,'2026-01-10',100,'file',NULL,'Active','2026-01-05 16:17:55','2026-01-05 16:17:55'),(11,'Artificial Intelligence','complete the assignment',8,1,1,'2026-01-10',100,'file',NULL,'Active','2026-01-06 11:02:29','2026-01-06 11:02:29');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `role_id` int unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `ID` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `ID` (`ID`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,'Hemanth SV','hemanthsv.al24@bitsathy.ac.in','ADM001','Administration','2025-12-31 10:15:57',1),(2,2,'Vikram S','vikrams.al24@bitsathy.ac.in','FAC001','Computer Science','2025-12-31 10:15:57',1),(3,2,'Sanjeevi Rajan Ramajayam','sanjeevirajanramajayam.cs24@bitsathy. ac.in','FAC002','Computer Science','2025-12-31 10:15:57',1),(4,2,'Gowtham J','gowthamj.al24@bitsathy.ac.in','FAC003','Artificial Intelligence','2025-12-31 10:15:57',1),(5,2,'Priya Sharma','priyas.cs24@bitsathy.ac. in','FAC004','Computer Science','2025-12-31 10:15:57',1),(6,2,'Rajesh Kumar','rajeshk.it24@bitsathy.ac. in','FAC005','Information Technology','2025-12-31 10:15:57',1),(7,2,'Anitha Devi','anithad. ec24@bitsathy.ac. in','FAC006','Electronics','2025-12-31 10:15:57',1),(8,2,'Karthik Raj','karthikr. cs24@bitsathy.ac. in','FAC007','Computer Science','2025-12-31 10:15:57',1),(9,2,'Deepa Lakshmi','deepal. it24@bitsathy.ac. in','FAC008','Information Technology','2025-12-31 10:15:57',1),(10,2,'Suresh Babu','sureshb.ai24@bitsathy.ac. in','FAC009','Artificial Intelligence','2025-12-31 10:15:57',1),(11,2,'Meena Kumari','meenak.cs24@bitsathy.ac.in','FAC010','Computer Science','2025-12-31 10:15:57',1),(12,3,'Gowtham CD','gowthamcd.it24@bitsathy.ac.in','STU001','Information Technology','2025-12-31 10:15:57',1),(13,3,'Prakash PV','prakashpv.cs24@bitsathy.ac.in','STU002','Computer Science','2025-12-31 10:15:57',1),(14,3,'Thirumurugan K','thirumurugank.al24@bitsathy.ac.in','STU003','Artificial Intelligence','2025-12-31 10:15:57',1),(15,3,'Arun Kumar M','arunkumarm.cs24@bitsathy.ac. in','STU004','Computer Science','2025-12-31 10:15:57',1),(16,3,'Divya Bharathi S','divyabharathis.it24@bitsathy.ac.in','STU005','Information Technology','2025-12-31 10:15:57',1),(17,3,'Harish Raj P','harishrajp.ai24@bitsathy.ac. in','STU006','Artificial Intelligence','2025-12-31 10:15:57',1),(18,3,'Kavya Shree R','kavyashreer.cs24@bitsathy. ac.in','STU007','Computer Science','2025-12-31 10:15:57',1),(19,3,'Naveen Kumar V','naveenkumarv.it24@bitsathy.ac. in','STU008','Information Technology','2025-12-31 10:15:57',1),(20,3,'Preethi Lakshmi K','preethilakshmik.cs24@bitsathy. ac.in','STU009','Computer Science','2025-12-31 10:15:57',1),(21,3,'Rahul Krishnan S','rahulkrishnans.ai24@bitsathy.ac. in','STU010','Artificial Intelligence','2025-12-31 10:15:57',1),(22,3,'Santhosh Kumar R','santhoshkumarr.it24@bitsathy.ac.in','STU011','Information Technology','2025-12-31 10:15:57',1),(23,3,'Tharun Vijay M','tharunvijaym.cs24@bitsathy.ac.in','STU012','Computer Science','2025-12-31 10:15:57',1),(24,3,'Varsha Rani B','varsharanib.ai24@bitsathy.ac. in','STU013','Artificial Intelligence','2025-12-31 10:15:57',1),(25,3,'Akash Prabhu S','akashprabhus.cs24@bitsathy.ac. in','STU014','Computer Science','2025-12-31 10:15:57',1),(26,3,'Bhavani Devi R','bhavanidevir.it24@bitsathy.ac.in','STU015','Information Technology','2025-12-31 10:15:57',1),(27,3,'Dhanush Kumar K','dhanushkumark.cs24@bitsathy. ac.in','STU016','Computer Science','2025-12-31 10:15:57',1),(28,3,'Geethanjali M','geethanjalim.ai24@bitsathy.ac. in','STU017','Artificial Intelligence','2025-12-31 10:15:57',1),(29,3,'Jayasurya P','jayasuryap.it24@bitsathy.ac. in','STU018','Information Technology','2025-12-31 10:15:57',1),(30,3,'Keerthana S','keerthanas.cs24@bitsathy. ac.in','STU019','Computer Science','2025-12-31 10:15:57',1),(31,3,'Lokesh Rajan V','lokeshrajanv.ai24@bitsathy.ac. in','STU020','Artificial Intelligence','2025-12-31 10:15:57',1),(32,3,'Manoj Krishna B','manojkrishnab.cs24@bitsathy.ac. in','STU021','Computer Science','2025-12-31 10:15:57',1),(33,3,'Nithya Shree K','nithyashreek.it24@bitsathy.ac.in','STU022','Information Technology','2025-12-31 10:15:57',1),(34,3,'Pranav Reddy S','pranavreddys.ai24@bitsathy.ac.in','STU023','Artificial Intelligence','2025-12-31 10:15:57',1),(35,3,'Ramya Sree M','ramyasreem.cs24@bitsathy.ac.in','STU024','Computer Science','2025-12-31 10:15:57',1),(36,3,'Shreyas Kumar P','shreyaskumarp.it24@bitsathy.ac.in','STU025','Information Technology','2025-12-31 10:15:57',1),(37,2,'Arjun Kumar','arjunkumar@bitsathy.ac.in','FAC-012','AIML','2026-01-04 19:37:57',0),(38,2,'Mithul','mithul@bitsathy.ac.in','FAC-100','CSE','2026-01-06 09:30:10',1),(39,3,'Thirumurugan K','thirumurugank.ai24@bitsathy.ac.in','7376242AI134','AIML','2026-01-06 09:56:54',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venue`
--

DROP TABLE IF EXISTS `venue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venue` (
  `venue_id` int unsigned NOT NULL AUTO_INCREMENT,
  `venue_name` varchar(255) NOT NULL,
  `capacity` int NOT NULL DEFAULT '50',
  `location` varchar(255) DEFAULT '',
  `assigned_faculty_id` int unsigned DEFAULT NULL,
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`venue_id`),
  KEY `assigned_faculty_id` (`assigned_faculty_id`),
  CONSTRAINT `venue_ibfk_1` FOREIGN KEY (`assigned_faculty_id`) REFERENCES `faculties` (`faculty_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venue`
--

LOCK TABLES `venue` WRITE;
/*!40000 ALTER TABLE `venue` DISABLE KEYS */;
INSERT INTO `venue` VALUES (1,'AI & Machine Learning Lab',20,'IB',6,'Active','2025-12-31 10:15:57'),(2,'Web Development Lab',50,'',NULL,'Active','2025-12-31 10:15:57'),(3,'Mobile App Development Lab',50,'',NULL,'Active','2025-12-31 10:15:57'),(4,'Data Science Lab',50,'',NULL,'Active','2025-12-31 10:15:57'),(5,'Cyber Security Lab',50,'',NULL,'Active','2025-12-31 10:15:57'),(6,'Cloud Computing Lab',50,'',8,'Active','2025-12-31 10:15:57'),(7,'IoT Lab',50,'',NULL,'Active','2025-12-31 10:15:57'),(8,'Blockchain Lab',10,'',1,'Active','2025-12-31 10:15:57'),(9,'DevOps Lab',50,'',NULL,'Active','2025-12-31 10:15:57'),(10,'Full Stack Development Lab',50,'',NULL,'Active','2025-12-31 10:15:57'),(11,'Vedanayagam Auditorium',200,'IB,First Floor',13,'Active','2026-01-06 09:31:32');
/*!40000 ALTER TABLE `venue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venue_allocation`
--

DROP TABLE IF EXISTS `venue_allocation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venue_allocation` (
  `venloc_id` int unsigned NOT NULL AUTO_INCREMENT,
  `faculty_id` int unsigned NOT NULL,
  `venue_id` int unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `valid_till` datetime NOT NULL,
  PRIMARY KEY (`venloc_id`),
  KEY `faculty_id` (`faculty_id`),
  KEY `venue_id` (`venue_id`),
  CONSTRAINT `venue_allocation_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`faculty_id`) ON DELETE CASCADE,
  CONSTRAINT `venue_allocation_ibfk_2` FOREIGN KEY (`venue_id`) REFERENCES `venue` (`venue_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venue_allocation`
--

LOCK TABLES `venue_allocation` WRITE;
/*!40000 ALTER TABLE `venue_allocation` DISABLE KEYS */;
INSERT INTO `venue_allocation` VALUES (1,1,1,'2025-12-31 10:15:57','2026-06-30 10:15:57'),(2,2,2,'2025-12-31 10:15:57','2026-06-30 10:15:57'),(3,3,3,'2025-12-31 10:15:57','2026-06-30 10:15:57'),(4,4,4,'2025-12-31 10:15:57','2026-06-30 10:15:57'),(5,5,5,'2025-12-31 10:15:57','2026-06-30 10:15:57'),(6,6,6,'2025-12-31 10:15:57','2026-06-30 10:15:57'),(7,7,7,'2025-12-31 10:15:57','2026-06-30 10:15:57'),(8,8,8,'2025-12-31 10:15:57','2026-06-30 10:15:57'),(9,9,9,'2025-12-31 10:15:57','2026-06-30 10:15:57'),(10,10,10,'2025-12-31 10:15:57','2026-06-30 10:15:57');
/*!40000 ALTER TABLE `venue_allocation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venue_skills`
--

DROP TABLE IF EXISTS `venue_skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venue_skills` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `venue_id` int unsigned NOT NULL,
  `skill_id` int unsigned NOT NULL,
  `required_level` enum('Beginner','Intermediate','Advanced','Expert') NOT NULL DEFAULT 'Beginner',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_venue_skill` (`venue_id`,`skill_id`),
  KEY `skill_id` (`skill_id`),
  CONSTRAINT `venue_skills_ibfk_1` FOREIGN KEY (`venue_id`) REFERENCES `venue` (`venue_id`) ON DELETE CASCADE,
  CONSTRAINT `venue_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`skill_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venue_skills`
--

LOCK TABLES `venue_skills` WRITE;
/*!40000 ALTER TABLE `venue_skills` DISABLE KEYS */;
/*!40000 ALTER TABLE `venue_skills` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-07 12:03:20
