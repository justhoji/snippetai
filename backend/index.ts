import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "AI Powered Code Vault API is running!" });
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`🚀 Backend server running at http://localhost:${port}`);
});
