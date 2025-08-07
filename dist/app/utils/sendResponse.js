"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    if (res.headersSent)
        return;
    res.status(data.statusCode).send({
        success: data.success,
        message: data.message,
        meta: data.meta,
        data: data.data,
    });
};
exports.default = sendResponse;
