# astri-cacti-integrator
Astri Network Discovery is an automation tool designed to enhance Cacti monitoring capabilities. This tool performs device discovery through SNMP scanning and seamlessly integrates new devices into Cacti monitoring system.

## Key Features:
- Automatic device discovery using SNMP
- Database validation against existing Cacti devices
- Automated device registration to Cacti
- Smart integration with Cacti monitoring
- Bulk device management support

## Main Functions:
1. Checks for device existence in Cacti database
2. Performs SNMP connectivity tests
3. Automatically adds verified devices to Cacti
4. Handles Cacti service management

-- Create astri_logs table
CREATE TABLE astri_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_ip VARCHAR(255) NOT NULL,
    action VARCHAR(50) NOT NULL,
    status ENUM('SUCCESS', 'FAILED') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50) DEFAULT 'SYSTEM',
    description TEXT,
    INDEX idx_device_ip (device_ip),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create astri_errors table
CREATE TABLE astri_errors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    log_id INT NOT NULL,
    error_code VARCHAR(20) NOT NULL,
    error_message TEXT NOT NULL,
    error_type VARCHAR(50) NOT NULL,
    stack_trace TEXT,
    error_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    severity ENUM('HIGH', 'MEDIUM', 'LOW') NOT NULL,
    FOREIGN KEY (log_id) REFERENCES astri_logs(id) ON DELETE CASCADE,
    INDEX idx_error_code (error_code),
    INDEX idx_error_type (error_type),
    INDEX idx_severity (severity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: Create trigger to update error_time automatically
DELIMITER //
CREATE TRIGGER before_error_insert 
BEFORE INSERT ON astri_errors
FOR EACH ROW
BEGIN
    SET NEW.error_time = CURRENT_TIMESTAMP;
END;//
DELIMITER ;