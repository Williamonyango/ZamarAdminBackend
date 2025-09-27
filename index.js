import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js";
import authroutes from "./routes/auth.routes.js";
import imageRoutes from "./routes/images.routes.js";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors configuration
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// database connection
db;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authroutes);

app.use("/images", imageRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
