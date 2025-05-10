const Item = require('../models/items.js');

const addItem = async (req, res) => {
  const { description, quantity, rate, amount } = req.body;
  // Check for required fields
  if (!description || !quantity || !rate || !amount) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Create a new product instance
  const item = new Item({ 
    description: req.body.description, 
    quantity: req.body.quantity, 
    rate: req.body.rate, 
    amount: req.body.amount,
  });

  try {
    // Save the product to the database
    await item.save();
    res.status(201).json({ message: "item Added" });
  } catch (error) {
    console.error("Error adding item:", error); // Log the error for debugging
    res.status(500).json({ error: "Failed to add item" });
  }
};
module.exports = {addItem}