CREATE TABLE role(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) DEFAULT(0),
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);
DESCRIBE role;