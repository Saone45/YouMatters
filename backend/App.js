const express = require("express");
const app = express();
const cookieParser = require("cookie-parser"); // Keep this line
const bodyParser = require("body-parser"); // Corrected import
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

const errorMiddleware = require("./middleware/error");

// config

dotenv.config({ path: "backend/config/config.env"});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Use express.urlencoded
app.use(fileUpload());

// Route imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// Middleware for Error
app.use(errorMiddleware);

module.exports = app;
