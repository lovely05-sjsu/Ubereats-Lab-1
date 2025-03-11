require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const { sequelize } = require('./models');
const path = require("path");
const db = require('./models'); // Import the entire models object
const { Restaurant, MenuItem, Review } = require('./models/index');




const app = express();
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To handle URL-encoded form data
//app.use(cors());
app.use(session({ secret: 'ubereats-secret', resave: false, saveUninitialized: true }));

app.use(
    cors({
        origin: "http://localhost:3000", // React frontend URL
        credentials: true, // Allow cookies/sessions
        methods: "GET,POST,PUT,DELETE",
        allowedHeaders: "Content-Type,Authorization",
    })
);

app.use(
    session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // ❗ Set to true in production with HTTPS
            httpOnly: true, // Prevent XSS attacks
            sameSite: "lax",
        },
    })
);

  
// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require("./routes/user.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const emailRoutes = require("./routes/email.routes");
const orderRoutes = require("./routes/order.routes");

app.use('/api/email', emailRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", orderRoutes);

// Root endpoint
app.get('/',async (req, res) => {    
    res.send('UberEats API is running!');
});

app.get('/sync', async (req, res) => {
    try {
      await db.sequelize.sync({ force: true }); // Use force: true only for development
      res.send('Tables synced successfully!');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error syncing tables');
    }
  });  

// Serve static files (images) if needed (useful for restaurant image uploads, etc.)
app.use('/images', express.static(path.join(__dirname, 'images')));

// Start server
const PORT = process.env.PORT || 2000;
sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error("Database connection error:", err));
