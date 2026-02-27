-- Create database
CREATE DATABASE IF NOT EXISTS todo_app;
USE todo_app;

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status ENUM('pending', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data (optional)
INSERT INTO tasks (title, status) VALUES
    ('Complete project documentation', 'pending'),
    ('Review pull requests', 'completed'),
    ('Setup AWS RDS connection', 'pending'),
    ('Deploy application to EC2', 'pending'),
    ('Test database migration', 'completed');