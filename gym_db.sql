CREATE DATABASE gym_db_new;
USE gym_db_new;

-- Create the MEMBER table
CREATE TABLE MEMBER (
    Member_id INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100),
    Phone VARCHAR(15)
);

-- Create the MEMBER_TYPE table
CREATE TABLE MEMBER_TYPE (
    Membership_type INT IDENTITY(1,1) PRIMARY KEY,
    TypeName VARCHAR(50),
    Duration INT,
    Price DECIMAL(10,2)
);

-- Create the PAYMENT table
CREATE TABLE PAYMENT (
    Payment_id INT IDENTITY(1,1) PRIMARY KEY,
    Amount DECIMAL(10,2),
    Payment_method VARCHAR(50)
);

-- Create the MODE_OF_PAYMENT table
CREATE TABLE MODE_OF_PAYMENT (
    Member_id INT,
    Payment_id INT,
    PRIMARY KEY (Member_id, Payment_id),
    FOREIGN KEY (Member_id) REFERENCES MEMBER(Member_id),
    FOREIGN KEY (Payment_id) REFERENCES PAYMENT(Payment_id)
);

-- Create the HAS table
CREATE TABLE HAS (
    Member_id INT,
    Membership_type INT,
    PRIMARY KEY (Member_id, Membership_type),
    FOREIGN KEY (Member_id) REFERENCES MEMBER(Member_id),
    FOREIGN KEY (Membership_type) REFERENCES MEMBER_TYPE(Membership_type)
);

-- Create the CLASS table
CREATE TABLE CLASS (
    Class_id INT IDENTITY(1,1) PRIMARY KEY,
    Class_name VARCHAR(100),
    Schedule VARCHAR(50)
);

-- Create the TRAINER table
CREATE TABLE TRAINER (
    Trainer_id INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100),
    Phone VARCHAR(15),
    Specification VARCHAR(100)
);

-- Create the CLASSES_TAKEN table
CREATE TABLE CLASSES_TAKEN (
    Class_id INT,
    Trainer_id INT,
    PRIMARY KEY (Class_id, Trainer_id),
    FOREIGN KEY (Class_id) REFERENCES CLASS(Class_id),
    FOREIGN KEY (Trainer_id) REFERENCES TRAINER(Trainer_id)
);

-- Insert sample member types
INSERT INTO MEMBER_TYPE (TypeName, Duration, Price) VALUES ('Monthly', 30, 50.00);
INSERT INTO MEMBER_TYPE (TypeName, Duration, Price) VALUES ('Yearly', 365, 500.00);

-- Insert sample payments
INSERT INTO PAYMENT (Amount, Payment_method) VALUES (50.00, 'Credit Card');
INSERT INTO PAYMENT (Amount, Payment_method) VALUES (500.00, 'Cash');

-- Insert sample members
INSERT INTO MEMBER (Name, Phone) VALUES ('John Doe', '1234567890');
INSERT INTO MEMBER (Name, Phone) VALUES ('Jane Smith', '9876543210');

-- Insert sample HAS relationships (linking members to membership types)
INSERT INTO HAS (Member_id, Membership_type) VALUES (1, 1);
INSERT INTO HAS (Member_id, Membership_type) VALUES (2, 2);

-- Insert sample classes
INSERT INTO CLASS (Class_name, Schedule) VALUES ('Yoga', 'Mon-Wed-Fri 6 AM');
INSERT INTO CLASS (Class_name, Schedule) VALUES ('Pilates', 'Tue-Thu 7 PM');

-- Insert sample trainers
INSERT INTO TRAINER (Name, Phone, Specification) VALUES ('Alice Smith', '5551234567', 'Yoga Expert');
INSERT INTO TRAINER (Name, Phone, Specification) VALUES ('Bob Johnson', '5557654321', 'Pilates Expert');

-- Insert sample CLASSES_TAKEN relationships
INSERT INTO CLASSES_TAKEN (Class_id, Trainer_id) VALUES (1, 1);
INSERT INTO CLASSES_TAKEN (Class_id, Trainer_id) VALUES (2, 2);


-- Check all tables in the database
SELECT * FROM MEMBER;
SELECT * FROM MEMBER_TYPE;
SELECT * FROM PAYMENT;
SELECT * FROM CLASS;
SELECT * FROM TRAINER;
SELECT * FROM CLASSES_TAKEN;
SELECT * FROM HAS;
SELECT * FROM MODE_OF_PAYMENT;
GRANT INSERT, SELECT, UPDATE, DELETE ON dbo.MEMBER TO gymmembership;

CREATE TABLE USERS (
    User_id INT IDENTITY(1,1) PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(100) UNIQUE,
    Password VARCHAR(255)
);
insert into USERS values('John Doe', 'john.doe@example.com', 'hashed_password_1')
select * from USERS

GRANT INSERT, SELECT, UPDATE, DELETE ON dbo.MEMBER TO gymmembership;
