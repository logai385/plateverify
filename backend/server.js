import chalk from "chalk";
import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import path from "path";
import connectionToDB from "./config/connectionToDB.js";
import mongoSanitize from "express-mongo-sanitize";
import { morganMiddleware, systemLogs } from "./utils/logger.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { apiLimiter } from "./middleware/apiLimiter.js";
import cors from "cors";
// import routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
// create express app
const app = express();
// cors
app.use(cors());
// set static folder
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
// connect to database
await connectionToDB();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// body parser & urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// cookie parser
app.use(cookieParser());
// sanitize data
app.use(mongoSanitize());
// morgan middleware
app.use(morganMiddleware);
// route test && main route
app.get("/api/v1/test", (req, res) => {
  res.json({
    hi: "welcome to the invoice application",
  });
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", apiLimiter, userRoutes);
app.use("/api/v1/document", apiLimiter, documentRoutes);
app.use("/api/v1/upload", apiLimiter, uploadRoutes)
// not found & error handler
app.use(notFound);
app.use(errorHandler);

// app listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  systemLogs.info(
    `server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
  // console.log
  console.log(
    `server running in ${chalk.yellow.bold(
      process.env.NODE_ENV
    )} mode on port ${chalk.blue.bold(PORT)}...`
  );
});
