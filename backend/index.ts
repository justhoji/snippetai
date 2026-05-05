import "dotenv/config";
import express from "express";
import routes from "./startup/routes";

const app = express();

routes(app);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
