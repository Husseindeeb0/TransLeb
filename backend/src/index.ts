import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbconnect";
import coordinatesRoute from "./routes/coordinates.route";
import cors from "cors";
import corsOptions from "./config/corsOptions";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use("/coordinates", coordinatesRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
