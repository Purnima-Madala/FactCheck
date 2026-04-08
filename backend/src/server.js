import "dotenv/config";
import express from "express";
import cors from "cors";
import { arenaRateLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { arenaRouter } from "./routes.js";

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(arenaRateLimiter);
app.use(arenaRouter);
app.use(errorHandler);

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "neuralarena-backend" });
});

app.listen(port, () => {
  console.log(`NeuralArena backend running on port ${port}`);
});
