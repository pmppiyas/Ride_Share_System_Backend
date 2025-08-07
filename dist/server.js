"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const env_1 = require("./config/env");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
let server;
const port = env_1.envVars.PORT;
const startServer = async () => {
    try {
        await mongoose_1.default.connect(env_1.envVars.DB_URL);
        console.log("Connected to Ride Share Database");
        server = app_1.default.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error("Error during startup:", error);
    }
};
(async () => {
    await startServer();
    await (0, seedSuperAdmin_1.seedSUperAdmin)();
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
