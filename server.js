const express = require('express');
const app = express();
const sql = require('mssql');
const cors = require('cors');

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

// SQL Server connection setup
const dbConfig = {
  user: 'gymmembership', // Update with your SQL Server username
  password: 'gym_db', // Update with your SQL Server password
  server: 'localhost', // Update with your SQL Server host
  database: 'gym_db_new',
  options: {
    encrypt: true, // Use encryption
    trustServerCertificate: true // Change to true if you're using self-signed certificates
  }
};

// Connect to SQL Server
sql.connect(dbConfig).then(pool => {
  console.log('Connected to SQL Server database');
  
  // API to register a member and return Member_id
  app.post('/api/members', async (req, res) => {
    const { name, phone, membership_type } = req.body;

    try {
      // Insert the member into MEMBER table
      const result = await pool.request()
        .input('name', sql.VarChar, name)
        .input('phone', sql.VarChar, phone)
        .query('INSERT INTO MEMBER (Name, Phone) OUTPUT INSERTED.Member_id VALUES (@name, @phone)');
      
      const memberId = result.recordset[0].Member_id;

      // Insert the membership type into HAS table
      await pool.request()
        .input('member_id', sql.Int, memberId)
        .input('membership_type', sql.Int, membership_type)
        .query('INSERT INTO HAS (Member_id, Membership_type) VALUES (@member_id, @membership_type)');

      res.status(201).json({ message: 'Member registered successfully', memberId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error registering member' });
    }
  });

  // API to register a trainer
  app.post('/api/trainers', async (req, res) => {
    const { name, phone, specification } = req.body;

    try {
      // Insert the trainer into TRAINER table
      const result = await pool.request()
        .input('name', sql.VarChar, name)
        .input('phone', sql.VarChar, phone)
        .input('specification', sql.VarChar, specification)
        .query('INSERT INTO TRAINER (Name, Phone, Specification) OUTPUT INSERTED.Trainer_id VALUES (@name, @phone, @specification)');
      
      const trainerId = result.recordset[0].Trainer_id;

      res.status(201).json({ message: 'Trainer registered successfully', trainerId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error registering trainer' });
    }
  });

  // API to register a class
  app.post('/api/classes', async (req, res) => {
    const { class_name, schedule } = req.body;

    try {
      // Insert the class into CLASS table
      const result = await pool.request()
        .input('class_name', sql.VarChar, class_name)
        .input('schedule', sql.VarChar, schedule)
        .query('INSERT INTO CLASS (Class_name, Schedule) OUTPUT INSERTED.Class_id VALUES (@class_name, @schedule)');
      
      const classId = result.recordset[0].Class_id;

      res.status(201).json({ message: 'Class registered successfully', classId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error registering class' });
    }
  });

  // API to assign a trainer to a class
  app.post('/api/classes/trainers', async (req, res) => {
    const { class_id, trainer_id } = req.body;

    try {
      // Link trainer to class in CLASSES_TAKEN table
      await pool.request()
        .input('class_id', sql.Int, class_id)
        .input('trainer_id', sql.Int, trainer_id)
        .query('INSERT INTO CLASSES_TAKEN (Class_id, Trainer_id) VALUES (@class_id, @trainer_id)');

      res.status(201).json({ message: 'Trainer assigned to class successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error assigning trainer to class' });
    }
  });

  // API to handle payments and return Member_id
  app.post('/api/payments', async (req, res) => {
    const { payment_member_id, payment_amount, payment_method } = req.body;

    // Basic validation to ensure required fields are present
    if (!payment_member_id || !payment_amount || !payment_method) {
      return res.status(400).json({ error: 'Missing required fields (payment_member_id, payment_amount, payment_method)' });
    }

    try {
      // Insert the payment into the PAYMENT table
      const paymentResult = await pool.request()
        .input('amount', sql.Decimal(10, 2), payment_amount)
        .input('payment_method', sql.VarChar, payment_method)
        .query('INSERT INTO PAYMENT (Amount, Payment_method) OUTPUT INSERTED.Payment_id VALUES (@amount, @payment_method)');
      
      const paymentId = paymentResult.recordset[0].Payment_id;

      // Link the payment to the member in the MODE_OF_PAYMENT table
      await pool.request()
        .input('member_id', sql.Int, payment_member_id)
        .input('payment_id', sql.Int, paymentId)
        .query('INSERT INTO MODE_OF_PAYMENT (Member_id, Payment_id) VALUES (@member_id, @payment_id)');

      // Return a success message
      res.status(201).json({ message: 'Payment made successfully', memberId: payment_member_id });
    } catch (err) {
      // Log and return error message
      console.error(err);
      res.status(500).json({ error: 'Error processing payment' });
    }
});

}).catch(err => {
  console.error('Database connection failed:', err);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
