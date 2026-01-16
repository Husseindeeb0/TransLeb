import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbconnect";
import coordinatesRoute from "./routes/coordinates.route";
import userRouter from "./routes/user.route";
import cors from "cors";
import corsOptions from "./config/corsOptions";
import http from "http";
import { initSocket } from "./config/socketio";
import socketRouter from "./socketio";

dotenv.config();

const app = express();
connectDB();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use("/coordinates", coordinatesRoute);
app.use("/user", userRouter);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
initSocket(server);
socketRouter();

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
