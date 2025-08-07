// server.js
import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import redisClient from "./config/redis.js";

dotenv.config();
const PORT = process.env.PORT || 8000;

// ✅ Connect DB
connectDB();

// ✅ Start server
const server = app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
);

// ✅ Graceful shutdown
process.on("SIGINT", async () => {
    console.log("🛑 Gracefully shutting down...");
    await redisClient.quit(); // Close Redis connection
    server.close(() => {
        console.log("✅ Server closed.");
        process.exit(0);
    });
});
