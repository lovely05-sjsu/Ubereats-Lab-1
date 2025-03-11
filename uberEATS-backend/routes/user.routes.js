const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const { User } = require("../models");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password, type } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, type });
  res.json(user);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user && (await bcrypt.compare(password, user.password))) {
    req.session.user = user;
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// GET customer details by ID
router.get("/profile/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await User.findOne({
      where: { id },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
