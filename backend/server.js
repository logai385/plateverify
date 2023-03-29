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

// create express app
const app = express();

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
// route test
app.get("/api/v1/test", (req, res) => {
  res.json({
    hi: "welcome to the invoice application",
  });
});


// not found & error handler
app.use(notFound);
app.use(errorHandler);

// app listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  systemLogs.info(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  // console.log
    console.log("server running in " + chalk.yellow.bold(process.env.NODE_ENV) + " mode on port " + chalk.blue.bold(PORT) + "...");
});