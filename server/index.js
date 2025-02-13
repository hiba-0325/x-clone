import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/mongoDb.js";
import authRoute from "./routes/authRoutes.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import notifRoute from "./routes/notifRoutes.js";
import errorHandler from "./middlewares/globalErrorHandler.js";

const app = express();
dotenv.config();

connectDB();
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/messages", messageRoute);
app.use("/notifications", notifRoute);

app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler)

const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
