/* eslint-disable no-console */
import { envVars } from "./config/env";
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { seedSUperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const port = envVars.PORT;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Connected to Ride Share Database");

    server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error during startup:", error);
  }
};

(async () => {
  await startServer();
  await seedSUperAdmin();
})();

process.on("unhandledRejection", (err) => {
  console.log("Unhandle Rejection Detected... Server sutting down", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.log("Uncaught exception detected. Server sutting down", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("Sigterm signal recieved. Server sutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal recieved. Server sutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
