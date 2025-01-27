import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/mongoDb.js";
import authRoute from "./routes/authRoutes.js";

const app = express();
dotenv.config();
connectDB();

app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/auth", authRoute);

const port = process.env.PORT || 3005; // Default to 3005 if PORT is not set in .env
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
