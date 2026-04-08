import rateLimit from "express-rate-limit";

export const arenaRateLimiter = rateLimit({
  windowMs: 60_000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests. Please try again in a minute."
  }
});
