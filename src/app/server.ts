import { mongoose } from "mong";
import { Server } from "http";
import mongoose from "mongoose";
let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect();
  } catch (error) {}
};
