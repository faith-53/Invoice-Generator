const Client = require('../models/client.js');

const addClient = async (req, res) => {
  const { name, email, address, phone } = req.body;
  // Check for required fields
  if (!name || !email || !address || !phone) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Create a new product instance
  const client = new Client({ 
    name: req.body.name, 
    email: req.body.email, 
    address: req.body.address, 
    phone: req.body.phone
  });

  try {
    // Save the product to the database
    await client.save();
    res.status(201).json({ message: "client Added" });
  } catch (error) {
    console.error("Error adding client:", error); // Log the error for debugging
    res.status(500).json({ error: "Failed to add client" });
  }
};
module.exports = {addClient}