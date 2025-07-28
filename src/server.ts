/* eslint-disable no-console */
import { envVars } from "./config/env";
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

startServer();
