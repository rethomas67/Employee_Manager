CREATE TABLE employee(
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,    
    role_id INT NOT NULL,
    manager_id INT NULL,
    FOREIGN KEY (role_id) REFERENCES role(id)
    ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(id)
    ON DELETE CASCADE
);
DESCRIBE employee;