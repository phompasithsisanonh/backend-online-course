require("dotenv").config();
require("express-async-errors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const { createClient } = require("redis");
const RedisStore = require("connect-redis").default;
const methodOverride = require("method-override");
const express = require("express");
const ms = require("ms");
const app = express();
const path = require('path');
const cors = require("cors");
const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");
const routers = require("./router/router");
const connectDB =require("./db/connect")
const corsOptions = {
  origin: [`${process.env.FRONTEND_URL}`],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  optionSuccessStatus: 200,
};
// Middleware setup
const setupMiddleware = async () => {
  const setupRedis = async () => {
    let redisClient = createClient({
      url: process.env.REDIS_URL,
      legacyMode: true,
    });

    redisClient.on("error", (err) => {
      console.error("Redis Client Error", err);
    });

    try {
      await redisClient.connect();
      console.log("Connected to Redis");
    } catch (err) {
      console.error("Error connecting to Redis:", err);
    }

    return redisClient;
  };

  const setupSession = (redisClient) => {
    return new RedisStore({
      client: redisClient,
      prefix: "myapp:",
    });
  };
  const redisClient = async () => {
    await setupRedis();
  };
  const redisStore = setupSession(redisClient);
  const sessionOptions = {
    store: redisStore,
    secret: process.env.SECRET_URL,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: ms("3d"),
    },
    rolling: true,
    resave: false,
    saveUninitialized: false,
  };

  app.use(cors(corsOptions));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(session(sessionOptions));
  app.use(cookieParser("ab231"));
  app.use(methodOverride("_method"));
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
  // Routes
  app.use("/api", routers);

  // Error handling
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  try {
    await connectDB(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
};

setupMiddleware().catch((error) => {
  console.error("Setup Error:", error);
  process.exit(1);
});
// module.exports = app;
const PORT = 8001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
